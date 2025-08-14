// @ts-nocheck
// Dynamic / optional dependency handling for 'mssql' so local dev & tests don't require the driver.
// We intentionally avoid a static import so that environments without 'mssql' installed (e.g., CI light tests)
// can still exercise higher-layer logic using an in‑memory no-op stub.
let mssql: any = null;
let mssqlAvailable = true;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  mssql = require("mssql");
} catch {
  mssqlAvailable = false;
}

import { DefaultAzureCredential } from "@azure/identity";

export interface SQLConfig {
  server: string;
  database: string;
  user?: string;
  password?: string;
  useManagedIdentity?: boolean;
  options?: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    connectionTimeout: number;
    requestTimeout: number;
  };
}

export interface DenialPattern {
  id: string;
  patternName: string;
  denialReason: string;
  diagnosisCodes: string[];
  clinicalIndicators: string[];
  riskScore: number;
  successRate: number;
  averageAppealTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppealCase {
  id: string;
  patientId: string;
  encounterId: string;
  denialPatternId: string;
  denialReason: string;
  denialAmount: number;
  appealStatus:
    | "pending"
    | "submitted"
    | "under_review"
    | "approved"
    | "denied";
  submissionDate?: string;
  decisionDate?: string;
  outcome: "pending" | "overturned" | "upheld" | "partial";
  recoveryAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface KPIMetric {
  id: string;
  metricName: string;
  metricValue: number;
  targetValue: number;
  unit: string;
  category: string;
  timePeriod: string;
  calculatedAt: string;
}

export interface ClinicalDocument {
  id: string;
  patientId: string;
  encounterId: string;
  documentType: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Lightweight chainable stub objects replicating the subset of the mssql API we use.
class StubRequest {
  input() {
    return this;
  }
  async query(_sql: string) {
    return { recordset: [] };
  }
}
class StubPool {
  async connect() {
    return this;
  }
  request() {
    return new StubRequest();
  }
  async close() {
    /* no-op */
  }
}

export class AzureSQLService {
  private config: SQLConfig;
  private pool: any | null = null; // mssql.ConnectionPool or StubPool

  constructor() {
    this.config = {
      server: process.env.AZURE_SQL_SERVER || "localhost",
      database: process.env.AZURE_SQL_DATABASE || "billigent",
      user: process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
      useManagedIdentity: !process.env.AZURE_SQL_USER,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
    };
  }

  /**
   * Initialize database connection pool
   */
  private async getConnection(): Promise<any> {
    // returns real or stub pool
    if (this.pool) {
      return this.pool;
    }

    try {
      // If driver missing, fall back to stub (in-memory no-op implementation)
      if (!mssqlAvailable) {
        this.pool = new StubPool();
        return this.pool;
      }

      let sqlConfig: any;

      if (this.config.useManagedIdentity) {
        // Use Managed Identity
        const credential = new DefaultAzureCredential();
        const token = await credential.getToken(
          "https://database.windows.net/"
        );

        if (!token) {
          throw new Error("Failed to get access token for Managed Identity");
        }

        sqlConfig = {
          server: this.config.server,
          database: this.config.database,
          options: {
            ...this.config.options,
            authentication: {
              type: "azure-active-directory-access-token",
              options: {
                token: token.token,
              },
            },
          },
        };
      } else {
        // Use SQL Authentication
        sqlConfig = {
          server: this.config.server,
          database: this.config.database,
          user: this.config.user!,
          password: this.config.password!,
          options: this.config.options,
        };
      }

      this.pool = await new mssql.ConnectionPool(sqlConfig).connect();
      return this.pool;
    } catch (error) {
      console.error("Failed to connect to Azure SQL Database:", error);
      throw new Error(
        `Database connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Initialize database schema
   */
  async initializeSchema(): Promise<void> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      // Skip DDL when running with stub
      console.log("[azure-sql] Stub mode: skipping schema initialization");
      return;
    }

    try {
      // Create tables if they don't exist
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='denial_patterns' AND xtype='U')
        CREATE TABLE denial_patterns (
          id NVARCHAR(255) PRIMARY KEY,
          pattern_name NVARCHAR(500) NOT NULL,
          denial_reason NVARCHAR(1000) NOT NULL,
          diagnosis_codes NVARCHAR(MAX),
          clinical_indicators NVARCHAR(MAX),
          risk_score DECIMAL(5,2),
          success_rate DECIMAL(5,2),
          average_appeal_time INT,
          created_at DATETIME2 DEFAULT GETDATE(),
          updated_at DATETIME2 DEFAULT GETDATE()
        )
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='appeal_cases' AND xtype='U')
        CREATE TABLE appeal_cases (
          id NVARCHAR(255) PRIMARY KEY,
          patient_id NVARCHAR(255) NOT NULL,
          encounter_id NVARCHAR(255) NOT NULL,
          denial_pattern_id NVARCHAR(255),
          denial_reason NVARCHAR(1000) NOT NULL,
          denial_amount DECIMAL(10,2),
          appeal_status NVARCHAR(50) DEFAULT 'pending',
          submission_date DATETIME2,
          decision_date DATETIME2,
          outcome NVARCHAR(50) DEFAULT 'pending',
          recovery_amount DECIMAL(10,2),
          created_at DATETIME2 DEFAULT GETDATE(),
          updated_at DATETIME2 DEFAULT GETDATE(),
          FOREIGN KEY (denial_pattern_id) REFERENCES denial_patterns(id)
        )
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='kpi_metrics' AND xtype='U')
        CREATE TABLE kpi_metrics (
          id NVARCHAR(255) PRIMARY KEY,
          metric_name NVARCHAR(255) NOT NULL,
          metric_value DECIMAL(10,4) NOT NULL,
          target_value DECIMAL(10,4),
          unit NVARCHAR(50),
          category NVARCHAR(100),
          time_period NVARCHAR(50),
          calculated_at DATETIME2 DEFAULT GETDATE()
        )
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clinical_documents' AND xtype='U')
        CREATE TABLE clinical_documents (
          id NVARCHAR(255) PRIMARY KEY,
          patient_id NVARCHAR(255) NOT NULL,
          encounter_id NVARCHAR(255) NOT NULL,
          document_type NVARCHAR(100) NOT NULL,
          content NVARCHAR(MAX),
          metadata NVARCHAR(MAX),
          created_at DATETIME2 DEFAULT GETDATE(),
          updated_at DATETIME2 DEFAULT GETDATE()
        )
      `);

      // Create indexes for performance
      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_appeal_cases_patient_id')
        CREATE INDEX IX_appeal_cases_patient_id ON appeal_cases(patient_id)
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_appeal_cases_encounter_id')
        CREATE INDEX IX_appeal_cases_encounter_id ON appeal_cases(encounter_id)
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_appeal_cases_appeal_status')
        CREATE INDEX IX_appeal_cases_appeal_status ON appeal_cases(appeal_status)
      `);

      await pool.request().query(`
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_kpi_metrics_category_time')
        CREATE INDEX IX_kpi_metrics_category_time ON kpi_metrics(category, time_period)
      `);

      console.log("Database schema initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database schema:", error);
      throw error;
    }
  }

  /**
   * Store denial pattern
   */
  async storeDenialPattern(pattern: DenialPattern): Promise<void> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return;
    }

    try {
      await pool
        .request()
        .input("id", pattern.id)
        .input("patternName", pattern.patternName)
        .input("denialReason", pattern.denialReason)
        .input("diagnosisCodes", JSON.stringify(pattern.diagnosisCodes))
        .input("clinicalIndicators", JSON.stringify(pattern.clinicalIndicators))
        .input("riskScore", pattern.riskScore)
        .input("successRate", pattern.successRate)
        .input("averageAppealTime", pattern.averageAppealTime).query(`
          INSERT INTO denial_patterns (id, pattern_name, denial_reason, diagnosis_codes, 
                                     clinical_indicators, risk_score, success_rate, average_appeal_time)
          VALUES (@id, @patternName, @denialReason, @diagnosisCodes, 
                  @clinicalIndicators, @riskScore, @successRate, @averageAppealTime)
          ON DUPLICATE KEY UPDATE
            pattern_name = @patternName,
            denial_reason = @denialReason,
            diagnosis_codes = @diagnosisCodes,
            clinical_indicators = @clinicalIndicators,
            risk_score = @riskScore,
            success_rate = @successRate,
            average_appeal_time = @averageAppealTime,
            updated_at = GETDATE()
        `);
    } catch (error) {
      console.error("Failed to store denial pattern:", error);
      throw error;
    }
  }

  /**
   * Get denial patterns by diagnosis codes
   */
  async getDenialPatternsByCodes(
    diagnosisCodes: string[]
  ): Promise<DenialPattern[]> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return [];
    }

    try {
      const codesJson = JSON.stringify(diagnosisCodes);
      const result = await pool.request().input("codes", codesJson).query(`
          SELECT * FROM denial_patterns 
          WHERE JSON_CONTAINS(diagnosis_codes, @codes)
          ORDER BY risk_score DESC, success_rate DESC
        `);

      return result.recordset.map((record) => ({
        id: record.id,
        patternName: record.pattern_name,
        denialReason: record.denial_reason,
        diagnosisCodes: JSON.parse(record.diagnosis_codes || "[]"),
        clinicalIndicators: JSON.parse(record.clinical_indicators || "[]"),
        riskScore: record.risk_score,
        successRate: record.success_rate,
        averageAppealTime: record.average_appeal_time,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      }));
    } catch (error) {
      console.error("Failed to get denial patterns:", error);
      throw error;
    }
  }

  /**
   * Store appeal case
   */
  async storeAppealCase(appealCase: AppealCase): Promise<void> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return;
    }

    try {
      await pool
        .request()
        .input("id", appealCase.id)
        .input("patientId", appealCase.patientId)
        .input("encounterId", appealCase.encounterId)
        .input("denialPatternId", appealCase.denialPatternId)
        .input("denialReason", appealCase.denialReason)
        .input("denialAmount", appealCase.denialAmount)
        .input("appealStatus", appealCase.appealStatus)
        .input("submissionDate", appealCase.submissionDate)
        .input("decisionDate", appealCase.decisionDate)
        .input("outcome", appealCase.outcome)
        .input("recoveryAmount", appealCase.recoveryAmount).query(`
          INSERT INTO appeal_cases (id, patient_id, encounter_id, denial_pattern_id, 
                                   denial_reason, denial_amount, appeal_status, submission_date,
                                   decision_date, outcome, recovery_amount)
          VALUES (@id, @patientId, @encounterId, @denialPatternId, 
                  @denialReason, @denialAmount, @appealStatus, @submissionDate,
                  @decisionDate, @outcome, @recoveryAmount)
        `);
    } catch (error) {
      console.error("Failed to store appeal case:", error);
      throw error;
    }
  }

  /**
   * Update appeal case status
   */
  async updateAppealCaseStatus(
    id: string,
    status: AppealCase["appealStatus"],
    outcome?: AppealCase["outcome"],
    recoveryAmount?: number
  ): Promise<void> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return;
    }

    try {
      let query = `
        UPDATE appeal_cases 
        SET appeal_status = @status, updated_at = GETDATE()
      `;

      const request = pool.request().input("id", id).input("status", status);

      if (outcome) {
        query += ", outcome = @outcome";
        request.input("outcome", outcome);
      }

      if (recoveryAmount !== undefined) {
        query += ", recovery_amount = @recoveryAmount";
        request.input("recoveryAmount", recoveryAmount);
      }

      if (status === "approved" || status === "denied") {
        query += ", decision_date = GETDATE()";
      }

      query += " WHERE id = @id";

      await request.query(query);
    } catch (error) {
      console.error("Failed to update appeal case status:", error);
      throw error;
    }
  }

  /**
   * Get appeal cases by patient
   */
  async getAppealCasesByPatient(patientId: string): Promise<AppealCase[]> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return [];
    }

    try {
      const result = await pool.request().input("patientId", patientId).query(`
          SELECT * FROM appeal_cases 
          WHERE patient_id = @patientId
          ORDER BY created_at DESC
        `);

      return result.recordset.map((record) => ({
        id: record.id,
        patientId: record.patient_id,
        encounterId: record.encounter_id,
        denialPatternId: record.denial_pattern_id,
        denialReason: record.denial_reason,
        denialAmount: record.denial_amount,
        appealStatus: record.appeal_status,
        submissionDate: record.submission_date,
        decisionDate: record.decision_date,
        outcome: record.outcome,
        recoveryAmount: record.recovery_amount,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      }));
    } catch (error) {
      console.error("Failed to get appeal cases:", error);
      throw error;
    }
  }

  /**
   * Store KPI metric
   */
  async storeKPIMetric(metric: KPIMetric): Promise<void> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return {};
    }

    try {
      await pool
        .request()
        .input("id", metric.id)
        .input("metricName", metric.metricName)
        .input("metricValue", metric.metricValue)
        .input("targetValue", metric.targetValue)
        .input("unit", metric.unit)
        .input("category", metric.category)
        .input("timePeriod", metric.timePeriod).query(`
          INSERT INTO kpi_metrics (id, metric_name, metric_value, target_value, 
                                  unit, category, time_period)
          VALUES (@id, @metricName, @metricValue, @targetValue, 
                  @unit, @category, @timePeriod)
        `);
    } catch (error) {
      console.error("Failed to store KPI metric:", error);
      throw error;
    }
  }

  /**
   * Get KPI metrics by category and time period
   */
  async getKPIMetrics(
    category: string,
    timePeriod: string,
    limit: number = 100
  ): Promise<KPIMetric[]> {
    const pool = await this.getConnection();
    if (!mssqlAvailable) {
      return;
    }

    try {
      const result = await pool
        .request()
        .input("category", category)
        .input("timePeriod", timePeriod)
        .input("limit", limit).query(`
          SELECT TOP (@limit) * FROM kpi_metrics 
          WHERE category = @category AND time_period = @timePeriod
          ORDER BY calculated_at DESC
        `);

      return result.recordset.map((record) => ({
        id: record.id,
        metricName: record.metric_name,
        metricValue: record.metric_value,
        targetValue: record.target_value,
        unit: record.unit,
        category: record.category,
        timePeriod: record.time_period,
        calculatedAt: record.calculated_at,
      }));
    } catch (error) {
      console.error("Failed to get KPI metrics:", error);
      throw error;
    }
  }

  /**
   * Calculate real-time KPIs
   */
  async calculateRealTimeKPIs(): Promise<Record<string, number>> {
    const pool = await this.getConnection();

    try {
      // Calculate various KPIs
      const kpis: Record<string, number> = {};

      // Initial denial rate
      const denialRateResult = await pool.request().query(`
        SELECT 
          CAST(COUNT(CASE WHEN appeal_status = 'pending' THEN 1 END) AS FLOAT) / 
          CAST(COUNT(*) AS FLOAT) as denial_rate
        FROM appeal_cases
        WHERE created_at >= DATEADD(day, -30, GETDATE())
      `);
      kpis.initial_denial_rate =
        denialRateResult.recordset[0]?.denial_rate || 0;

      // Appeal success rate
      const successRateResult = await pool.request().query(`
        SELECT 
          CAST(COUNT(CASE WHEN outcome = 'overturned' THEN 1 END) AS FLOAT) / 
          CAST(COUNT(CASE WHEN outcome IN ('overturned', 'upheld') THEN 1 END) AS FLOAT) as success_rate
        FROM appeal_cases
        WHERE outcome IN ('overturned', 'upheld')
        AND created_at >= DATEADD(day, -90, GETDATE())
      `);
      kpis.appeal_success_rate =
        successRateResult.recordset[0]?.success_rate || 0;

      // Average appeal cycle time
      const cycleTimeResult = await pool.request().query(`
        SELECT AVG(DATEDIFF(day, created_at, decision_date)) as avg_cycle_time
        FROM appeal_cases
        WHERE decision_date IS NOT NULL
        AND created_at >= DATEADD(day, -90, GETDATE())
      `);
      kpis.avg_appeal_cycle_time =
        cycleTimeResult.recordset[0]?.avg_cycle_time || 0;

      // Recovery rate
      const recoveryRateResult = await pool.request().query(`
        SELECT 
          CAST(SUM(ISNULL(recovery_amount, 0)) AS FLOAT) / 
          CAST(SUM(denial_amount) AS FLOAT) as recovery_rate
        FROM appeal_cases
        WHERE outcome = 'overturned'
        AND created_at >= DATEADD(day, -90, GETDATE())
      `);
      kpis.recovery_rate = recoveryRateResult.recordset[0]?.recovery_rate || 0;

      return kpis;
    } catch (error) {
      console.error("Failed to calculate real-time KPIs:", error);
      throw error;
    }
  }

  /**
   * Store clinical document
   */
  async storeClinicalDocument(document: ClinicalDocument): Promise<void> {
    const pool = await this.getConnection();

    try {
      await pool
        .request()
        .input("id", document.id)
        .input("patientId", document.patientId)
        .input("encounterId", document.encounterId)
        .input("documentType", document.documentType)
        .input("content", document.content)
        .input("metadata", JSON.stringify(document.metadata)).query(`
          INSERT INTO clinical_documents (id, patient_id, encounter_id, document_type, 
                                         content, metadata)
          VALUES (@id, @patientId, @encounterId, @documentType, 
                  @content, @metadata)
        `);
    } catch (error) {
      console.error("Failed to store clinical document:", error);
      throw error;
    }
  }

  /**
   * Get clinical documents by patient and encounter
   */
  async getClinicalDocuments(
    patientId: string,
    encounterId?: string
  ): Promise<ClinicalDocument[]> {
    const pool = await this.getConnection();

    try {
      let query = `
        SELECT * FROM clinical_documents 
        WHERE patient_id = @patientId
      `;

      const request = pool.request().input("patientId", patientId);

      if (encounterId) {
        query += " AND encounter_id = @encounterId";
        request.input("encounterId", encounterId);
      }

      query += " ORDER BY created_at DESC";

      const result = await request.query(query);

      return result.recordset.map((record) => ({
        id: record.id,
        patientId: record.patient_id,
        encounterId: record.encounter_id,
        documentType: record.document_type,
        content: record.content,
        metadata: JSON.parse(record.metadata || "{}"),
        createdAt: record.created_at,
        updatedAt: record.updated_at,
      }));
    } catch (error) {
      console.error("Failed to get clinical documents:", error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: string;
    database: string;
    server: string;
    connectionTime: number;
  }> {
    const startTime = Date.now();

    try {
      const pool = await this.getConnection();
      await pool.request().query("SELECT 1");

      const connectionTime = Date.now() - startTime;

      return {
        status: "healthy",
        database: this.config.database,
        server: this.config.server,
        connectionTime,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        database: this.config.database,
        server: this.config.server,
        connectionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}

// Export singleton instance
export const azureSqlService = new AzureSQLService();
export default azureSqlService;
