import { Request, Response, Router } from "express";
import * as multer from "multer";
import { prisma } from "../services/prisma.service";
import {
  getResponse,
  startPdfAnalysis,
} from "../services/responses-api.service";

const router: Router = Router();
const upload = multer.default({ storage: multer.default.memoryStorage() });
// Fallback in-memory map when DB column `responseId` is not yet migrated
const pendingTaskByDenialId = new Map<string, string>();

// GET /api/denials - List denials with filtering
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", status, caseId } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (status) where.status = status;
    if (caseId) where.caseId = caseId; // Keep as string, don't parse to int

    const [denials, total] = await Promise.all([
      prisma.denial.findMany({
        where,
        skip,
        take: limitNum,
        select: {
          id: true,
          claimFhirId: true,
          denialReasonCode: true,
          deniedAmount: true,
          status: true,
          appealLetterDraft: true,
          denialReason: true,
          amount: true,
          appealDate: true,
          resolution: true,
          createdAt: true,
          updatedAt: true,
          caseId: true,
          case: {
            select: {
              id: true,
              patientFhirId: true,
              encounterFhirId: true,
              status: true,
              assignedUser: {
                select: { id: true, fullName: true, email: true },
              },
            },
          },
        },
        orderBy: { id: "desc" },
      }),
      prisma.denial.count({ where }),
    ]);

    res.json({
      denials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching denials:", error);
    res.status(500).json({ error: "Failed to fetch denials" });
  }
});

// GET /api/denials/baseline - Initial Denial Rate & Top 5 root causes (R1 minimal slice)
router.get("/baseline", async (_req: Request, res: Response) => {
  try {
    if (process.env.SAFE_MODE === "true") {
      return res.json({
        initialDenialRate: null,
        totalDenials: 0,
        topCauses: [],
      });
    }

    let totalDenials = 0;
    let grouped: Array<{
      denialReason: string | null;
      _count: { id: number };
    }> = [];
    try {
      [totalDenials, grouped] = await Promise.all([
        prisma.denial.count(),
        prisma.denial.groupBy({ by: ["denialReason"], _count: { id: true } }),
      ]);
    } catch (dbErr) {
      console.warn("Denials baseline DB unavailable, returning stub metrics");
      return res.json({
        initialDenialRate: null,
        totalDenials: 0,
        topCauses: [],
      });
    }

    const initialDenialRate = null; // denominator (total claims submitted) not yet modeled
    const topCauses = grouped
      .map((g) => ({ reason: g.denialReason || "Unknown", count: g._count.id }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({ initialDenialRate, totalDenials, topCauses });
  } catch (error) {
    console.error("Error computing denial baseline:", error);
    res.status(500).json({ error: "Failed to compute denial baseline" });
  }
});

// GET /api/denials/:id - Get denial by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const denial = await prisma.denial.findUnique({
      where: { id },
      select: {
        id: true,
        claimFhirId: true,
        denialReasonCode: true,
        deniedAmount: true,
        status: true,
        appealLetterDraft: true,
        appealDate: true,
        resolution: true,
        createdAt: true,
        updatedAt: true,
        denialReason: true,
        amount: true,
        caseId: true,
        case: {
          select: {
            id: true,
            patientFhirId: true,
            encounterFhirId: true,
            assignedUser: {
              select: { id: true, fullName: true, email: true, userRole: true },
            },
          },
        },
      },
    });

    if (!denial) {
      return res.status(404).json({ error: "Denial not found" });
    }

    res.json(denial);
  } catch (error) {
    console.error("Error fetching denial:", error);
    res.status(500).json({ error: "Failed to fetch denial" });
  }
});

// POST /api/denials - Create new denial
// POST /api/denials - Create case & denial and start async PDF analysis (multipart)
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    // If no file is provided, fall back to legacy JSON creation flow
    if (!req.file) {
      const {
        caseId,
        claimFhirId,
        denialReasonCode,
        deniedAmount,
        status,
        denialReason,
        amount,
      } = req.body;

      // Validate existing case
      const existingCase = await prisma.case.findUnique({
        where: { id: caseId },
      });
      if (!existingCase) {
        return res.status(400).json({ error: "Case not found" });
      }

      // Create denial
      const denial = await prisma.denial.create({
        data: {
          caseId,
          claimFhirId,
          denialReasonCode,
          deniedAmount: parseFloat(deniedAmount),
          status: status || "pending",
          denialReason: denialReason || "Not specified",
          amount: amount ? parseFloat(amount) : 0,
        },
      });

      // Log analytics event
      await prisma.analytics.create({
        data: {
          metric: "denial_created",
          value: 1,
          caseId: caseId,
          userId: existingCase.assignedUserId || "system",
          activityType: "denial_created",
          description: "Denial manually created via API",
        },
      });

      return res.status(201).json(denial);
    }

    // File upload flow
    const { patientFhirId, encounterFhirId } = req.body;

    // Find or create case
    let newCase = await prisma.case.findFirst({
      where: { encounterFhirId },
    });

    if (!newCase) {
      newCase = await prisma.case.create({
        data: {
          title: `Denial Case for ${encounterFhirId}`,
          patientFhirId,
          encounterFhirId,
          status: "active",
        },
      });
    }

    // Create denial with file upload
    const denial = await prisma.denial.create({
      data: {
        caseId: newCase.id,
        claimFhirId: req.body.claimFhirId || null,
        denialReason: "Uploaded PDF - Analysis Pending",
        amount: 0,
        status: "analyzing",
      },
      select: {
        id: true,
        claimFhirId: true,
        denialReasonCode: true,
        deniedAmount: true,
        status: true,
        appealLetterDraft: true,
        denialReason: true,
        amount: true,
        appealDate: true,
        resolution: true,
        createdAt: true,
        updatedAt: true,
        caseId: true,
        case: {
          select: {
            id: true,
            patientFhirId: true,
            encounterFhirId: true,
            status: true,
            assignedUser: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    });

    // Start PDF analysis
    const taskId = await startPdfAnalysis(req.file.buffer, denial.id);
    pendingTaskByDenialId.set(denial.id, taskId);

    // Log analytics event
    await prisma.analytics.create({
      data: {
        metric: "denial_pdf_uploaded",
        value: 1,
        caseId: newCase.id,
        userId: newCase.assignedUserId || "system",
        activityType: "denial_created",
        description: "Denial created with PDF upload",
      },
    });

    res.status(201).json({
      message: "Denial created and PDF analysis started",
      denial,
      taskId,
    });
  } catch (error) {
    console.error("Error creating denial:", error);
    res.status(500).json({ error: "Failed to create denial" });
  }
});

// PUT /api/denials/:id - Update denial
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDenial = await prisma.denial.update({
      where: { id },
      data: updates,
      include: {
        case: {
          select: {
            id: true,
            patientFhirId: true,
            encounterFhirId: true,
            status: true,
            assignedUser: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    });

    // Log analytics event
    await prisma.analytics.create({
      data: {
        metric: "denial_updated",
        value: 1,
        caseId: updatedDenial.caseId,
        userId: updatedDenial.case?.assignedUser?.id || "system",
        activityType: "denial_updated",
        description: "Denial updated via API",
      },
    });

    res.json(updatedDenial);
  } catch (error) {
    console.error("Error updating denial:", error);
    res.status(500).json({ error: "Failed to update denial" });
  }
});

// DELETE /api/denials/:id - Delete denial
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const denial = await prisma.denial.findUnique({ where: { id } });
    if (!denial) {
      return res.status(404).json({ error: "Denial not found" });
    }

    await prisma.denial.delete({ where: { id } });

    // Log analytics event
    await prisma.analytics.create({
      data: {
        metric: "denial_deleted",
        value: 1,
        caseId: denial.caseId,
        userId: "system",
        activityType: "denial_deleted",
        description: `Denial ${id} deleted`,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting denial:", error);
    res.status(500).json({ error: "Failed to delete denial" });
  }
});

// GET /api/denials/:id/status - Check analysis status for denial
router.get("/:id/status", async (req: Request, res: Response) => {
  try {
    const denialId = req.params.id;

    const denial = await prisma.denial.findUnique({
      where: { id: denialId },
      select: { status: true },
    });

    if (!denial) {
      return res.status(404).json({ error: "Denial not found" });
    }

    const responseId = pendingTaskByDenialId.get(denialId);

    if (denial.status === "Analyzing" && responseId) {
      try {
        const response = await getResponse(responseId);
        if (response.status === "completed") {
          await prisma.denial.update({
            where: { id: denialId },
            data: {
              status: "AnalysisComplete",
              appealLetterDraft: response.result?.appealLetter || null,
            },
          });
          pendingTaskByDenialId.delete(denialId);
          return res.json({
            status: "AnalysisComplete",
            result: response.result,
          });
        } else if (response.status === "in_progress") {
          return res.json({ status: "Analyzing", progress: response.progress });
        }
      } catch (error) {
        console.error("Error checking response status:", error);
        await prisma.denial.update({
          where: { id: denialId },
          data: { status: "AnalysisFailed" },
        });
        pendingTaskByDenialId.delete(denialId);
        return res.json({ status: "AnalysisFailed", error: "Analysis failed" });
      }
    }

    res.json({ status: denial.status });
  } catch (error) {
    console.error("Error checking denial status:", error);
    res.status(500).json({ error: "Failed to check denial status" });
  }
});

export default router;
