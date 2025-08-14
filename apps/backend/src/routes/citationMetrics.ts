import { Router, type Router as ExpressRouter } from "express";
import {
  loadNormalizedCitations,
  computeCitationCoverage,
  findCitationByTitle,
  type NormalizedCitation,
  type AuthorityTier,
} from "../strategy/citations";
// import { evidenceGraph } from "../strategy/evidenceGraph";

const router: ExpressRouter = Router();

/**
 * GET /api/citation-metrics/health
 * Citation system health check and overview
 */
router.get("/health", (req, res) => {
  try {
    const citations = loadNormalizedCitations();
    const issues = citations.filter((c) => c.issues && c.issues.length > 0);

    // Calculate authority distribution
    const authorityDistribution: Record<AuthorityTier, number> = {
      regulatory: 0,
      standards: 0,
      primary: 0,
      secondary: 0,
      tertiary: 0,
      competitive: 0,
    };

    citations.forEach((citation) => {
      authorityDistribution[citation.authorityTier]++;
    });

    // Calculate category distribution
    const categoryDistribution: Record<string, number> = {};
    citations.forEach((citation) => {
      categoryDistribution[citation.category] =
        (categoryDistribution[citation.category] || 0) + 1;
    });

    // Determine overall health status
    const totalCitations = citations.length;
    const citationsWithIssues = issues.length;
    const issuePercentage =
      totalCitations > 0 ? citationsWithIssues / totalCitations : 0;

    let status: "healthy" | "degraded" | "unhealthy" = "healthy";
    if (issuePercentage > 0.1) status = "degraded";
    if (issuePercentage > 0.3) status = "unhealthy";

    const healthData = {
      status,
      timestamp: new Date().toISOString(),
      metrics: {
        totalCitations,
        citationsWithIssues,
        issuePercentage: issuePercentage * 100,
        authorityDistribution,
        categoryDistribution,
      },
      issues: issues.map((c) => ({
        id: c.id,
        title: c.canonicalTitle,
        issues: c.issues,
        category: c.category,
        authorityTier: c.authorityTier,
      })),
    };

    res.json(healthData);
  } catch (error) {
    console.error("Error in citation health check:", error);
    res.status(500).json({
      error: "Failed to retrieve citation health data",
      status: "unhealthy",
    });
  }
});

/**
 * GET /api/citation-metrics/analytics
 * Comprehensive citation analytics
 */
router.get("/analytics", (req, res) => {
  try {
    const citations = loadNormalizedCitations();
    const issues = citations.filter((c) => c.issues && c.issues.length > 0);

    // Authority tier analysis
    const authorityDistribution: Record<AuthorityTier, number> = {
      regulatory: 0,
      standards: 0,
      primary: 0,
      secondary: 0,
      tertiary: 0,
      competitive: 0,
    };

    // Category analysis
    const categoryDistribution: Record<string, number> = {};
    const categoryAuthorityTiers: Record<string, AuthorityTier[]> = {};

    citations.forEach((citation) => {
      authorityDistribution[citation.authorityTier]++;
      categoryDistribution[citation.category] =
        (categoryDistribution[citation.category] || 0) + 1;

      if (!categoryAuthorityTiers[citation.category]) {
        categoryAuthorityTiers[citation.category] = [];
      }
      if (
        !categoryAuthorityTiers[citation.category].includes(
          citation.authorityTier
        )
      ) {
        categoryAuthorityTiers[citation.category].push(citation.authorityTier);
      }
    });

    // Quality metrics calculation
    const totalCitations = citations.length;
    const regulatoryCitations = authorityDistribution.regulatory;
    const standardsCitations = authorityDistribution.standards;

    const regulatoryComplianceScore =
      totalCitations > 0
        ? (regulatoryCitations + standardsCitations) / totalCitations
        : 0;

    const evidenceDiversityScore =
      Object.keys(categoryDistribution).length / 20; // Normalize to 0-1 scale

    // Calculate recency score based on retrieval dates
    const now = new Date();
    const recencyScores = citations.map((c) => {
      if (!c.retrievalDate) return 0.5;
      const daysSince =
        (now.getTime() - new Date(c.retrievalDate).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSince < 30) return 1.0;
      if (daysSince < 90) return 0.8;
      if (daysSince < 365) return 0.6;
      return 0.4;
    });

    const sourceRecencyScore =
      recencyScores.length > 0
        ? recencyScores.reduce((sum, score) => sum + score, 0) /
          recencyScores.length
        : 0;

    // Overall authority score
    const tierScores: Record<AuthorityTier, number> = {
      regulatory: 1.0,
      standards: 0.9,
      primary: 0.8,
      secondary: 0.6,
      tertiary: 0.4,
      competitive: 0.3,
    };

    const overallAuthorityScore =
      citations.length > 0
        ? citations.reduce(
            (sum, c) => sum + (tierScores[c.authorityTier] || 0),
            0
          ) / citations.length
        : 0;

    // Determine confidence level
    const avgScore =
      (overallAuthorityScore +
        regulatoryComplianceScore +
        evidenceDiversityScore +
        sourceRecencyScore) /
      4;
    let confidenceLevel: "high" | "medium" | "low" = "low";
    if (avgScore >= 0.7) confidenceLevel = "high";
    else if (avgScore >= 0.4) confidenceLevel = "medium";

    const analyticsData = {
      overview: {
        total: totalCitations,
        withIssues: issues.length,
        qualityScore: ((totalCitations - issues.length) / totalCitations) * 100,
      },
      authorityDistribution,
      categoryDistribution,
      qualityMetrics: {
        overallAuthorityScore,
        regulatoryComplianceScore,
        evidenceDiversityScore,
        sourceRecencyScore,
        confidenceLevel,
      },
      categoryDetails: Object.entries(categoryDistribution)
        .map(([category, count]) => ({
          category,
          count,
          authorityTiers: categoryAuthorityTiers[category] || [],
          percentage: (count / totalCitations) * 100,
        }))
        .sort((a, b) => b.count - a.count),
    };

    res.json(analyticsData);
  } catch (error) {
    console.error("Error in citation analytics:", error);
    res.status(500).json({
      error: "Failed to retrieve citation analytics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/citation-metrics/citations
 * List all citations with optional filtering
 */
router.get("/citations", (req, res) => {
  try {
    const {
      authorityTier,
      category,
      hasIssues,
      limit = "50",
      offset = "0",
    } = req.query;

    let citations = loadNormalizedCitations();

    // Apply filters
    if (authorityTier && typeof authorityTier === "string") {
      citations = citations.filter((c) => c.authorityTier === authorityTier);
    }

    if (category && typeof category === "string") {
      citations = citations.filter((c) => c.category === category);
    }

    if (hasIssues === "true") {
      citations = citations.filter((c) => c.issues && c.issues.length > 0);
    } else if (hasIssues === "false") {
      citations = citations.filter((c) => !c.issues || c.issues.length === 0);
    }

    // Apply pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    const paginatedCitations = citations.slice(offsetNum, offsetNum + limitNum);

    res.json({
      citations: paginatedCitations,
      pagination: {
        total: citations.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < citations.length,
      },
      filters: {
        authorityTier: authorityTier || null,
        category: category || null,
        hasIssues: hasIssues || null,
      },
    });
  } catch (error) {
    console.error("Error in citations list:", error);
    res.status(500).json({
      error: "Failed to retrieve citations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/citation-metrics/citations/:id
 * Get specific citation by ID
 */
router.get("/citations/:id", (req, res) => {
  try {
    const { id } = req.params;
    const citations = loadNormalizedCitations();
    const citation = citations.find((c) => c.id === id);

    if (!citation) {
      return res.status(404).json({ error: "Citation not found" });
    }

    // Find related citations
    const relatedCitations = citations
      .filter(
        (c) =>
          c.id !== id &&
          (c.category === citation.category ||
            c.authorityTier === citation.authorityTier)
      )
      .slice(0, 5);

    res.json({
      citation,
      relatedCitations,
      metadata: {
        retrievedAt: new Date().toISOString(),
        totalCitations: citations.length,
      },
    });
  } catch (error) {
    console.error("Error in citation detail:", error);
    res.status(500).json({
      error: "Failed to retrieve citation",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/citation-metrics/coverage
 * Analyze citation coverage for specific sources
 */
router.post("/coverage", (req, res) => {
  try {
    const { sources } = req.body;

    if (!Array.isArray(sources)) {
      return res.status(400).json({
        error: "Sources must be an array of strings",
      });
    }

    const coverage = computeCitationCoverage(sources);

    // Enhanced coverage analysis
    const sourceDetails = sources.map((source) => {
      const citation = findCitationByTitle(source);
      return {
        source,
        found: !!citation,
        citation: citation
          ? {
              id: citation.id,
              authorityTier: citation.authorityTier,
              category: citation.category,
              url: citation.url,
            }
          : null,
      };
    });

    res.json({
      coverage,
      sourceDetails,
      recommendations: generateCoverageRecommendations(coverage, sourceDetails),
    });
  } catch (error) {
    console.error("Error in coverage analysis:", error);
    res.status(500).json({
      error: "Failed to analyze citation coverage",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/citation-metrics/evidence-quality
 * Analyze evidence bundle quality using citations
 */
router.post("/evidence-quality", (req, res) => {
  try {
    const { evidenceBundle } = req.body;

    if (!evidenceBundle || !evidenceBundle.sources) {
      return res.status(400).json({
        error: "Evidence bundle with sources is required",
      });
    }

    // Extract source citations from evidence bundle
    const sourceCitations = evidenceBundle.sources
      .map((s: any) => s.citation)
      .filter(Boolean);
    const coverage = computeCitationCoverage(sourceCitations);

    // Calculate quality metrics
    const qualityMetrics = calculateEvidenceQualityMetrics(
      evidenceBundle,
      sourceCitations
    );

    res.json({
      coverage,
      qualityMetrics,
      recommendations: generateQualityRecommendations(qualityMetrics, coverage),
    });
  } catch (error) {
    console.error("Error in evidence quality analysis:", error);
    res.status(500).json({
      error: "Failed to analyze evidence quality",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/citation-metrics/statistics
 * Get citation system statistics
 */
router.get("/statistics", (req, res) => {
  try {
    const citations = loadNormalizedCitations();

    // Basic statistics
    const total = citations.length;
    const withIssues = citations.filter(
      (c) => c.issues && c.issues.length > 0
    ).length;

    // Authority tier breakdown
    const byAuthorityTier: Record<AuthorityTier, number> = {
      regulatory: 0,
      standards: 0,
      primary: 0,
      secondary: 0,
      tertiary: 0,
      competitive: 0,
    };

    // Category breakdown
    const byCategory: Record<string, number> = {};

    citations.forEach((citation) => {
      byAuthorityTier[citation.authorityTier]++;
      byCategory[citation.category] = (byCategory[citation.category] || 0) + 1;
    });

    // Issue breakdown
    const issueTypes: Record<string, number> = {};
    citations.forEach((citation) => {
      if (citation.issues) {
        citation.issues.forEach((issue) => {
          issueTypes[issue] = (issueTypes[issue] || 0) + 1;
        });
      }
    });

    // Recency analysis
    const now = new Date();
    const recencyDistribution = {
      last30Days: 0,
      last90Days: 0,
      lastYear: 0,
      older: 0,
    };

    citations.forEach((citation) => {
      if (citation.retrievalDate) {
        const daysSince =
          (now.getTime() - new Date(citation.retrievalDate).getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysSince < 30) recencyDistribution.last30Days++;
        else if (daysSince < 90) recencyDistribution.last90Days++;
        else if (daysSince < 365) recencyDistribution.lastYear++;
        else recencyDistribution.older++;
      }
    });

    res.json({
      summary: {
        total,
        withIssues,
        qualityPercentage: ((total - withIssues) / total) * 100,
      },
      breakdowns: {
        byAuthorityTier,
        byCategory,
        byIssueType: issueTypes,
        byRecency: recencyDistribution,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        version: "1.0",
      },
    });
  } catch (error) {
    console.error("Error in citation statistics:", error);
    res.status(500).json({
      error: "Failed to retrieve citation statistics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Helper functions
function generateCoverageRecommendations(coverage: any, sourceDetails: any[]) {
  const recommendations = [];

  if (coverage.authoritativePct < 0.5) {
    recommendations.push({
      type: "warning",
      message:
        "Low authoritative coverage detected. Consider adding more regulatory and standards-based sources.",
      priority: "high",
    });
  }

  const unfoundSources = sourceDetails.filter((s) => !s.found);
  if (unfoundSources.length > 0) {
    recommendations.push({
      type: "info",
      message: `${unfoundSources.length} sources not found in citation database. Consider adding these to improve coverage.`,
      priority: "medium",
      sources: unfoundSources.map((s) => s.source),
    });
  }

  return recommendations;
}

function calculateEvidenceQualityMetrics(
  evidenceBundle: any,
  sourceCitations: string[]
) {
  const citations = loadNormalizedCitations();
  const tierScores: Record<AuthorityTier, number> = {
    regulatory: 1.0,
    standards: 0.9,
    primary: 0.8,
    secondary: 0.6,
    tertiary: 0.4,
    competitive: 0.3,
  };

  let totalScore = 0;
  let validSources = 0;
  const authorityTiers: AuthorityTier[] = [];

  sourceCitations.forEach((citation) => {
    const normalizedCitation = findCitationByTitle(citation);
    if (normalizedCitation) {
      totalScore += tierScores[normalizedCitation.authorityTier] || 0;
      validSources++;
      authorityTiers.push(normalizedCitation.authorityTier);
    }
  });

  const overallAuthorityScore =
    validSources > 0 ? totalScore / validSources : 0;
  const regulatoryComplianceScore =
    authorityTiers.filter((t) => t === "regulatory").length /
    authorityTiers.length;
  const evidenceDiversityScore = new Set(authorityTiers).size / 6; // 6 possible authority tiers

  return {
    overallAuthorityScore,
    regulatoryComplianceScore,
    evidenceDiversityScore,
    sourceCount: validSources,
    authorityTiers: [...new Set(authorityTiers)],
  };
}

function generateQualityRecommendations(qualityMetrics: any, coverage: any) {
  const recommendations = [];

  if (qualityMetrics.overallAuthorityScore < 0.7) {
    recommendations.push({
      type: "warning",
      message:
        "Low overall authority score. Consider using more regulatory and standards-based sources.",
      priority: "high",
    });
  }

  if (qualityMetrics.regulatoryComplianceScore < 0.5) {
    recommendations.push({
      type: "warning",
      message:
        "Low regulatory compliance. Ensure regulatory sources are included for compliance-critical evidence.",
      priority: "high",
    });
  }

  if (qualityMetrics.evidenceDiversityScore < 0.5) {
    recommendations.push({
      type: "info",
      message:
        "Limited evidence diversity. Consider including sources from different authority tiers for balanced analysis.",
      priority: "medium",
    });
  }

  return recommendations;
}

export default router;
