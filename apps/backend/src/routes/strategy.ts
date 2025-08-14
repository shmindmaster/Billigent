/**
 * Strategy prototype routes exposing evidence bundle, appeal draft, attribution, and rule evaluation.
 * Now integrated with Azure OpenAI and Azure Search for real AI capabilities.
 */
import { Router, type Request, type Response } from "express";
import { evidenceGraph } from "../strategy/evidenceGraph";
import { buildAppealDraft } from "../strategy/appealSample";
import {
  buildAttribution,
  validateAttribution,
} from "../strategy/explainability";
import { parseRule, evaluate } from "../strategy/kpiRulesDsl";
import { eventPublisher, makeEvent } from "../strategy/events";
// Import Azure services
import azureOpenAIService from "../services/azureOpenAI.service";
import azureSearchService from "../services/azureSearch.service";

const router: ReturnType<typeof Router> = Router();

router.get(
  "/evidence/:patternId/:encounterId",
  async (req: Request, res: Response) => {
    const { patternId, encounterId } = req.params;

    try {
      const tStart = Date.now();
      // First, try to get evidence from Azure Search
      const searchContext = {
        encounterId,
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
          end: new Date().toISOString(),
        },
      };

      // Search for clinical evidence
      const clinicalEvidence = await azureSearchService.searchClinicalEvidence(
        `encounter ${encounterId} clinical documentation`,
        searchContext
      );

      // Build evidence bundle with real data
      const bundle = evidenceGraph.buildEvidenceBundle(patternId, encounterId, {
        includeKpi: true,
        maxRegulations: 5,
      });

      if (!bundle) {
        return res.status(404).json({ error: "Pattern not found" });
      }

      // Enhance bundle with search results
      if (clinicalEvidence.results.length > 0) {
        // Add real clinical evidence to the bundle
        const realFacts = clinicalEvidence.results.map((result, index) => ({
          id: `REAL_FACT:${index}`,
          encounterId,
          text: result.document.content,
          codeIds: result.document.metadata.diagnosisCodes || [],
          sourceIds: [result.document.metadata.source],
        }));

        bundle.facts = [...bundle.facts, ...realFacts];
      }

      // Publish event
      eventPublisher.publish(
        makeEvent("query_generated", {
          queryId: bundle.bundleHash,
          denialPatternId: patternId,
          evidenceCount: bundle.facts.length,
          searchTime: clinicalEvidence.searchTime,
        })
      );

      // Emit operation timing for bundle build to appear in metrics snapshot
      eventPublisher.publish(
        makeEvent("op_timing", {
          label: "bundle_build",
          duration_ms: Date.now() - tStart,
          success: true,
          denialPatternId: patternId,
          encounterId,
        })
      );

      return res.json({
        ...bundle,
        searchMetadata: {
          totalEvidenceFound: clinicalEvidence.totalCount,
          searchTime: clinicalEvidence.searchTime,
          queryType: clinicalEvidence.queryType,
        },
      });
    } catch (error) {
      console.error("Error building evidence bundle:", error);
      eventPublisher.publish(
        makeEvent("op_timing", {
          label: "bundle_build",
          duration_ms: 0,
          success: false,
          denialPatternId: patternId,
          encounterId,
        })
      );
      return res.status(500).json({
        error: "Failed to build evidence bundle",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

router.get(
  "/appeal/:patternId/:encounterId",
  async (req: Request, res: Response) => {
    const { patternId, encounterId } = req.params;

    try {
      // Get evidence bundle
      const bundle = evidenceGraph.buildEvidenceBundle(patternId, encounterId, {
        includeKpi: true,
      });
      if (!bundle) {
        return res.status(404).json({ error: "Pattern not found" });
      }

      // Search for similar denial patterns
      const denialPatterns = await azureSearchService.searchDenialPatterns(
        "medical necessity", // This would come from the actual denial reason
        bundle.codes.map((c) => c.id.split(":").pop() || ""),
        { encounterId }
      );

      // Generate appeal draft using Azure OpenAI
      const appealRequest = {
        encounterId,
        denialPatternId: patternId,
        clinicalFacts: bundle.facts.map((f) => f.text),
        diagnosisCodes: bundle.codes.map((c) => c.id.split(":").pop() || ""),
        denialReason: "Medical necessity", // This would come from actual denial data
        payer: "Commercial", // This would come from actual payer data
      };

      let aiAppealDraft;
      try {
        aiAppealDraft = await azureOpenAIService.generateAppealDraft(
          appealRequest
        );
      } catch (aiError) {
        console.warn(
          "Azure OpenAI failed, falling back to mock draft:",
          aiError
        );
        // Fallback to mock draft if AI service fails
        aiAppealDraft = buildAppealDraft(bundle);
      }

      // Build attribution
      const attribution = buildAttribution(
        aiAppealDraft.draftId || `APPEAL:${encounterId}:${Date.now()}`,
        bundle.facts.map((f) => f.id),
        bundle.codes.map((c) => c.id)
      );

      const validation = validateAttribution(attribution);

      // Publish event
      const aiMeta: any = (aiAppealDraft as any).metadata || {};
      eventPublisher.publish(
        makeEvent("appeal_draft_generated", {
          draftId: (aiAppealDraft as any).draftId,
          encounterId,
          denialPatternId: patternId,
          aiGenerated: !!aiMeta,
          modelUsed: aiMeta.modelUsed || "mock",
        })
      );

      return res.json({
        draft: aiAppealDraft,
        attribution,
        validation,
        denialPatterns: denialPatterns.results.slice(0, 3), // Top 3 similar patterns
        searchMetadata: {
          patternsFound: denialPatterns.totalCount,
          searchTime: denialPatterns.searchTime,
        },
      });
    } catch (error) {
      console.error("Error generating appeal draft:", error);
      return res.status(500).json({
        error: "Failed to generate appeal draft",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

router.post("/rule/eval", (req, res) => {
  const { rule, metrics } = req.body || {};
  if (typeof rule !== "string" || !metrics || typeof metrics !== "object") {
    return res
      .status(400)
      .json({ error: "Provide rule (string) and metrics (object)" });
  }

  try {
    const parsed = parseRule(rule);
    const fired: any[] = [];

    evaluate(parsed, metrics, (eventType, payload) => {
      eventPublisher.publish({
        type: "rule_fired",
        occurredAt: new Date().toISOString(),
        payload: { ruleName: parsed.name, ...payload },
        version: "1.0.0",
      });
      fired.push(payload);
    });

    return res.json({ parsed, fired });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.get("/metrics/snapshot", (_req, res) => {
  // Build a telemetry snapshot of events currently in buffer
  const events = eventPublisher.getBuffer();
  const httpEvents = events.filter((e) => e.type === "http_request");
  const opEvents = events.filter((e) => e.type === "op_timing");
  const byOperation: Record<
    string,
    { count: number; avgMs: number; p95Ms: number }
  > = {};
  for (const op of opEvents) {
    const label = (op as any).payload.label;
    if (!byOperation[label])
      byOperation[label] = { count: 0, avgMs: 0, p95Ms: 0 };
    const rec = byOperation[label];
    rec.count += 1;
    // incremental average
    rec.avgMs =
      rec.avgMs + ((op as any).payload.duration_ms - rec.avgMs) / rec.count;
  }
  // compute p95 per operation
  for (const label of Object.keys(byOperation)) {
    const durations = opEvents
      .filter((o) => (o as any).payload.label === label)
      .map((o) => (o as any).payload.duration_ms)
      .sort((a, b) => a - b);
    if (durations.length) {
      const idx = Math.min(
        durations.length - 1,
        Math.floor(durations.length * 0.95)
      );
      byOperation[label].p95Ms = durations[idx];
    }
  }

  // Aggregate http perf buckets
  const perfBuckets = httpEvents.reduce<Record<string, number>>((acc, e) => {
    const b = (e as any).payload.perfBucket;
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  // Integrate citation metrics (non-blocking if module fails)
  let citations: any = undefined;
  try {
    const mod = require("../strategy/citations");
    if (typeof mod.loadNormalizedCitations === "function") {
      const all = mod.loadNormalizedCitations();
      const byTier: Record<string, number> = {};
      all.forEach((c: any) => {
        byTier[c.authorityTier] = (byTier[c.authorityTier] || 0) + 1;
      });
      // Simple sample coverage for canonical DEN:PAYERA:CO45 + ENC:demo1
      const coverage = mod.computeCitationCoverage?.(
        "DEN:PAYERA:CO45",
        "ENC:demo1"
      );
      citations = { total: all.length, byTier, sampleCoverage: coverage };
    }
  } catch (err) {
    citations = {
      error: "citation_metrics_unavailable",
      message: (err as any)?.message,
    };
  }

  return res.json({
    ts: new Date().toISOString(),
    http: {
      count: httpEvents.length,
      byPerfBucket: perfBuckets,
    },
    byOperation,
    citations,
  });
});

router.get("/events", (_req, res) => {
  return res.json(eventPublisher.getBuffer());
});

// New route for conversational AI
router.post("/conversational", async (req, res) => {
  const { query, context } = req.body || {};

  if (!query || !context?.caseId) {
    return res.status(400).json({
      error: "Provide query (string) and context with caseId",
    });
  }

  try {
    // Search for relevant clinical context
    const searchContext = {
      encounterId: context.caseId,
      patientId: context.patientId,
      diagnosisCodes: context.diagnosisCodes,
      clinicalNotes: context.clinicalSummary,
    };

    const searchResults = await azureSearchService.searchClinicalEvidence(
      query,
      searchContext
    );

    // Generate AI response
    const conversationalQuery = {
      query,
      context: {
        caseId: context.caseId,
        patientInfo: context.patientInfo,
        clinicalSummary: context.clinicalSummary,
        currentDRG: context.currentDRG,
      },
    };

    let aiResponse;
    try {
      aiResponse = await azureOpenAIService.generateConversationalResponse(
        conversationalQuery
      );
    } catch (aiError) {
      console.warn("Azure OpenAI failed for conversational query:", aiError);
      return res.status(500).json({
        error: "AI service unavailable",
        details: aiError instanceof Error ? aiError.message : "Unknown error",
      });
    }

    // Publish event
    eventPublisher.publish(
      makeEvent("conversational_query", {
        queryId: aiResponse.responseId,
        caseId: context.caseId,
        query,
        responseLength: aiResponse.content.length,
        modelUsed: aiResponse.metadata?.modelUsed || "unknown",
      })
    );

    return res.json({
      response: aiResponse,
      relevantDocuments: searchResults.results.slice(0, 5), // Top 5 relevant documents
      searchMetadata: {
        documentsFound: searchResults.totalCount,
        searchTime: searchResults.searchTime,
      },
    });
  } catch (error) {
    console.error("Error processing conversational query:", error);
    return res.status(500).json({
      error: "Failed to process conversational query",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// New route for clinical evidence search
router.post("/search/clinical", async (req, res) => {
  const { query, context } = req.body || {};

  if (!query) {
    return res.status(400).json({ error: "Provide search query" });
  }

  try {
    const searchResults = await azureSearchService.searchClinicalEvidence(
      query,
      context || {}
    );

    return res.json(searchResults);
  } catch (error) {
    console.error("Error searching clinical evidence:", error);
    return res.status(500).json({
      error: "Search failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// New route for denial pattern search
router.post("/search/denial-patterns", async (req, res) => {
  const { denialReason, diagnosisCodes, context } = req.body || {};

  if (!denialReason || !diagnosisCodes) {
    return res.status(400).json({
      error: "Provide denialReason and diagnosisCodes",
    });
  }

  try {
    const searchResults = await azureSearchService.searchDenialPatterns(
      denialReason,
      diagnosisCodes,
      context
    );

    return res.json(searchResults);
  } catch (error) {
    console.error("Error searching denial patterns:", error);
    return res.status(500).json({
      error: "Search failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Health check for Azure services
router.get("/health/azure", async (_req, res) => {
  try {
    const healthStatus = {
      timestamp: new Date().toISOString(),
      services: {
        openai: "unknown",
        search: "unknown",
      },
    };

    // Check Azure Search health
    try {
      const searchStats = await azureSearchService.getIndexStats();
      healthStatus.services.search = "healthy";
    } catch (error) {
      healthStatus.services.search = "unhealthy";
    }

    // Check Azure OpenAI health (simple test)
    try {
      // Try to generate a simple embedding
      await azureOpenAIService.generateEmbeddings("test");
      healthStatus.services.openai = "healthy";
    } catch (error) {
      healthStatus.services.openai = "unhealthy";
    }

    const allHealthy = Object.values(healthStatus.services).every(
      (status) => status === "healthy"
    );
    const statusCode = allHealthy ? 200 : 503;

    return res.status(statusCode).json(healthStatus);
  } catch (error) {
    return res.status(500).json({
      error: "Health check failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
