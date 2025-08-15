// @ts-nocheck
// Optional dependency pattern: allow tests/local runs without @azure/cosmos installed.
let CosmosClient: any;
let cosmosAvailable = true;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ CosmosClient } = require("@azure/cosmos"));
} catch {
  cosmosAvailable = false;
}
import { DefaultAzureCredential } from "@azure/identity";

export interface CosmosConfig {
  endpoint: string;
  key?: string;
  useManagedIdentity?: boolean;
  databaseName: string;
}

export interface EvidenceBundle {
  id: string;
  patientId: string;
  encounterId: string;
  bundleHash: string;
  facts: Array<{
    id: string;
    text: string;
    codeIds: string[];
    sourceIds: string[];
    confidence: number;
    timestamp: string;
  }>;
  codes: Array<{
    id: string;
    system: string;
    code: string;
    description: string;
    version: string;
  }>;
  regulations: Array<{
    id: string;
    citation: string;
    title: string;
    effectiveDate: string;
    authority: string;
  }>;
  sources: Array<{
    id: string;
    citation: string;
    type: string;
    url?: string;
    lastAccessed: string;
  }>;
  metadata: {
    generatedAt: string;
    version: string;
    checksum: string;
    attributionScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AttributionTracking {
  id: string;
  bundleId: string;
  patientId: string;
  attributionType: "l1_normalized" | "weighted_span" | "checksum_verified";
  spans: Array<{
    factId: string;
    weight: number;
    source: string;
    confidence: number;
    timestamp: string;
  }>;
  checksum: string;
  verificationStatus: "pending" | "verified" | "failed";
  verificationTimestamp?: string;
  auditTrail: Array<{
    action: string;
    timestamp: string;
    userId: string;
    details: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  metadata: Record<string, any>;
  changes: Array<{
    type: "insert" | "update" | "delete";
    field: string;
    oldValue?: any;
    newValue?: any;
    timestamp: string;
    userId: string;
  }>;
  checksum: string;
  createdAt: string;
  createdBy: string;
}

export interface CollaborationSession {
  id: string;
  sessionId: string;
  caseId: string;
  participants: Array<{
    userId: string;
    role: string;
    joinedAt: string;
    lastActivity: string;
  }>;
  activities: Array<{
    type: "comment" | "edit" | "review" | "approval";
    userId: string;
    content: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  status: "active" | "paused" | "completed";
  createdAt: string;
  updatedAt: string;
}

export class AzureCosmosService {
  private client: any;
  private database: any | null = null;
  private containers: Record<string, any> = {
    evidenceBundles: null,
    attributionTracking: null,
    documentVersions: null,
    collaborationSessions: null,
  };

  constructor() {
    const config: CosmosConfig = {
      endpoint:
        process.env.AZURE_COSMOS_ENDPOINT ||
        "https://billigent-cosmos-dev.documents.azure.com:443/",
      key: process.env.AZURE_COSMOS_KEY,
      useManagedIdentity: !process.env.AZURE_COSMOS_KEY,
      databaseName: process.env.AZURE_COSMOS_DATABASE || "billigent",
    };

    if (cosmosAvailable) {
      if (config.useManagedIdentity) {
        this.client = new CosmosClient({
          endpoint: config.endpoint,
          aadCredentials: new DefaultAzureCredential(),
        });
      } else {
        this.client = new CosmosClient({
          endpoint: config.endpoint,
          key: config.key!,
        });
      }
    } else {
      // Minimal in-memory stub shapes used by higher layers for tests
      const makeContainer = () => ({
        items: {
          create: async () => ({}),
          query: () => ({ fetchAll: async () => ({ resources: [] }) }),
        },
        item: () => ({
          read: async () => ({ resource: null }),
          replace: async () => ({}),
        }),
      });
      this.client = {
        databases: {
          createIfNotExists: async () => ({
            database: {
              containers: {
                createIfNotExists: async () => ({ container: makeContainer() }),
              },
            },
          }),
        },
        dispose: async () => {},
      };
    }
  }

  /**
   * Backwards-compatible accessor used by repositories that were written
   * expecting a static getInstance() factory. We already export a singleton
   * instance at the bottom of the file, so this simply returns it. Keeping
   * this method avoids touching every repository right now and is the
   * smallest change to restore build parity.
   */
  static getInstance(): AzureCosmosService {
    // The exported singleton is defined after the class declaration; runtime
    // order is safe because this method is only invoked after module load.
    return azureCosmosService;
  }

  async getOrCreateContainer(id: string, partitionKey: string) {
    await this.initialize();
    if (!this.database) throw new Error("Database not initialized");
    if (!this.containers[id]) {
      const { container } = await this.database.containers.createIfNotExists({
        id,
        partitionKey: { paths: [partitionKey] },
      });
      this.containers[id] = container;
    }
    return this.containers[id];
  }

  /**
   * Initialize database and default containers
   */
  async initialize(): Promise<void> {
    try {
      if (!cosmosAvailable) {
        // Initialize stub containers
        this.database = {};
        this.containers.evidenceBundles = {
          items: {
            create: async () => ({}),
            query: () => ({ fetchAll: async () => ({ resources: [] }) }),
          },
          item: () => ({
            read: async () => ({ resource: null }),
            replace: async () => ({}),
          }),
        };
        this.containers.attributionTracking = this.containers.evidenceBundles;
        this.containers.documentVersions = this.containers.evidenceBundles;
        this.containers.collaborationSessions = this.containers.evidenceBundles;
        return;
      }
      // Get or create database
      const { database } = await this.client.databases.createIfNotExists({
        id: "billigent",
      });
      this.database = database;

      // Get or create containers
      const { container: evidenceBundles } =
        await this.database.containers.createIfNotExists({
          id: "evidence-bundles",
          partitionKey: { paths: ["/patientId"] },
        });
      this.containers.evidenceBundles = evidenceBundles;

      const { container: attributionTracking } =
        await this.database.containers.createIfNotExists({
          id: "attribution-tracking",
          partitionKey: { paths: ["/bundleId"] },
        });
      this.containers.attributionTracking = attributionTracking;

      const { container: documentVersions } =
        await this.database.containers.createIfNotExists({
          id: "document-versions",
          partitionKey: { paths: ["/documentId"] },
        });
      this.containers.documentVersions = documentVersions;

      const { container: collaborationSessions } =
        await this.database.containers.createIfNotExists({
          id: "collaboration-sessions",
          partitionKey: { paths: ["/sessionId"] },
        });
      this.containers.collaborationSessions = collaborationSessions;

      console.log("Cosmos DB containers initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Cosmos DB:", error);
      throw error;
    }
  }

  /**
   * Store evidence bundle
   */
  async storeEvidenceBundle(bundle: EvidenceBundle): Promise<void> {
    if (!this.containers.evidenceBundles) {
      throw new Error("Evidence bundles container not initialized");
    }

    try {
      const item = {
        ...bundle,
        _partitionKey: bundle.patientId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.containers.evidenceBundles.items.create(item);
      console.log(`Evidence bundle stored: ${bundle.id}`);
    } catch (error) {
      console.error("Failed to store evidence bundle:", error);
      throw error;
    }
  }

  /**
   * Get evidence bundle by ID
   */
  async getEvidenceBundle(
    id: string,
    patientId: string
  ): Promise<EvidenceBundle | null> {
    if (!this.containers.evidenceBundles) {
      throw new Error("Evidence bundles container not initialized");
    }

    try {
      const { resource } = await this.containers.evidenceBundles
        .item(id, patientId)
        .read();
      return (resource as EvidenceBundle) || null;
    } catch (error) {
      if (error.code === 404) {
        return null;
      }
      console.error("Failed to get evidence bundle:", error);
      throw error;
    }
  }

  /**
   * Get evidence bundles by patient
   */
  async getEvidenceBundlesByPatient(
    patientId: string
  ): Promise<EvidenceBundle[]> {
    if (!this.containers.evidenceBundles) {
      throw new Error("Evidence bundles container not initialized");
    }

    try {
      const query =
        "SELECT * FROM c WHERE c.patientId = @patientId ORDER BY c.createdAt DESC";
      const { resources } = await this.containers.evidenceBundles.items
        .query({
          query,
          parameters: [{ name: "@patientId", value: patientId }],
        })
        .fetchAll();

      return resources as EvidenceBundle[];
    } catch (error) {
      console.error("Failed to get evidence bundles by patient:", error);
      throw error;
    }
  }

  /**
   * Store attribution tracking
   */
  async storeAttributionTracking(
    attribution: AttributionTracking
  ): Promise<void> {
    if (!this.containers.attributionTracking) {
      throw new Error("Attribution tracking container not initialized");
    }

    try {
      const item = {
        ...attribution,
        _partitionKey: attribution.bundleId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.containers.attributionTracking.items.create(item);
      console.log(`Attribution tracking stored: ${attribution.id}`);
    } catch (error) {
      console.error("Failed to store attribution tracking:", error);
      throw error;
    }
  }

  /**
   * Get attribution tracking by bundle ID
   */
  async getAttributionTracking(
    bundleId: string
  ): Promise<AttributionTracking | null> {
    if (!this.containers.attributionTracking) {
      throw new Error("Attribution tracking container not initialized");
    }

    try {
      const query =
        "SELECT * FROM c WHERE c.bundleId = @bundleId ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1";
      const { resources } = await this.containers.attributionTracking.items
        .query({ query, parameters: [{ name: "@bundleId", value: bundleId }] })
        .fetchAll();

      return (resources[0] as AttributionTracking) || null;
    } catch (error) {
      console.error("Failed to get attribution tracking:", error);
      throw error;
    }
  }

  /**
   * Update attribution verification status
   */
  async updateAttributionVerification(
    bundleId: string,
    status: AttributionTracking["verificationStatus"],
    checksum?: string
  ): Promise<void> {
    if (!this.containers.attributionTracking) {
      throw new Error("Attribution tracking container not initialized");
    }

    try {
      const attribution = await this.getAttributionTracking(bundleId);
      if (!attribution) {
        throw new Error("Attribution tracking not found");
      }

      const updateData = {
        verificationStatus: status,
        verificationTimestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (checksum) {
        updateData.checksum = checksum;
      }

      await this.containers.attributionTracking
        .item(attribution.id, bundleId)
        .replace({
          ...attribution,
          ...updateData,
        });

      console.log(`Attribution verification updated: ${bundleId} - ${status}`);
    } catch (error) {
      console.error("Failed to update attribution verification:", error);
      throw error;
    }
  }

  /**
   * Store document version
   */
  async storeDocumentVersion(version: DocumentVersion): Promise<void> {
    if (!this.containers.documentVersions) {
      throw new Error("Document versions container not initialized");
    }

    try {
      const item = {
        ...version,
        _partitionKey: version.documentId,
        createdAt: new Date().toISOString(),
      };

      await this.containers.documentVersions.items.create(item);
      console.log(
        `Document version stored: ${version.documentId} v${version.version}`
      );
    } catch (error) {
      console.error("Failed to store document version:", error);
      throw error;
    }
  }

  /**
   * Get document versions by document ID
   */
  async getDocumentVersions(documentId: string): Promise<DocumentVersion[]> {
    if (!this.containers.documentVersions) {
      throw new Error("Document versions container not initialized");
    }

    try {
      const query =
        "SELECT * FROM c WHERE c.documentId = @documentId ORDER BY c.version DESC";
      const { resources } = await this.containers.documentVersions.items
        .query({
          query,
          parameters: [{ name: "@documentId", value: documentId }],
        })
        .fetchAll();

      return resources as DocumentVersion[];
    } catch (error) {
      console.error("Failed to get document versions:", error);
      throw error;
    }
  }

  /**
   * Get latest document version
   */
  async getLatestDocumentVersion(
    documentId: string
  ): Promise<DocumentVersion | null> {
    const versions = await this.getDocumentVersions(documentId);
    return versions[0] || null;
  }

  /**
   * Store collaboration session
   */
  async storeCollaborationSession(
    session: CollaborationSession
  ): Promise<void> {
    if (!this.containers.collaborationSessions) {
      throw new Error("Collaboration sessions container not initialized");
    }

    try {
      const item = {
        ...session,
        _partitionKey: session.sessionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.containers.collaborationSessions.items.create(item);
      console.log(`Collaboration session stored: ${session.sessionId}`);
    } catch (error) {
      console.error("Failed to store collaboration session:", error);
      throw error;
    }
  }

  /**
   * Update collaboration session
   */
  async updateCollaborationSession(
    sessionId: string,
    updates: Partial<CollaborationSession>
  ): Promise<void> {
    if (!this.containers.collaborationSessions) {
      throw new Error("Collaboration sessions container not initialized");
    }

    try {
      const query =
        "SELECT * FROM c WHERE c.sessionId = @sessionId ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1";
      const { resources } = await this.containers.collaborationSessions.items
        .query({
          query,
          parameters: [{ name: "@sessionId", value: sessionId }],
        })
        .fetchAll();

      if (resources.length === 0) {
        throw new Error("Collaboration session not found");
      }

      const session = resources[0] as CollaborationSession;
      const updatedSession = {
        ...session,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.containers.collaborationSessions
        .item(session.id, sessionId)
        .replace(updatedSession);
      console.log(`Collaboration session updated: ${sessionId}`);
    } catch (error) {
      console.error("Failed to update collaboration session:", error);
      throw error;
    }
  }

  /**
   * Add activity to collaboration session
   */
  async addCollaborationActivity(
    sessionId: string,
    activity: CollaborationSession["activities"][0]
  ): Promise<void> {
    if (!this.containers.collaborationSessions) {
      throw new Error("Collaboration sessions container not initialized");
    }

    try {
      const query =
        "SELECT * FROM c WHERE c.sessionId = @sessionId ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1";
      const { resources } = await this.containers.collaborationSessions.items
        .query({
          query,
          parameters: [{ name: "@sessionId", value: sessionId }],
        })
        .fetchAll();

      if (resources.length === 0) {
        throw new Error("Collaboration session not found");
      }

      const session = resources[0] as CollaborationSession;
      const updatedSession = {
        ...session,
        activities: [...session.activities, activity],
        updatedAt: new Date().toISOString(),
      };

      await this.containers.collaborationSessions
        .item(session.id, sessionId)
        .replace(updatedSession);
      console.log(`Activity added to collaboration session: ${sessionId}`);
    } catch (error) {
      console.error("Failed to add collaboration activity:", error);
      throw error;
    }
  }

  /**
   * Get collaboration session by ID
   */
  async getCollaborationSession(
    sessionId: string
  ): Promise<CollaborationSession | null> {
    if (!this.containers.collaborationSessions) {
      throw new Error("Collaboration sessions container not initialized");
    }

    try {
      const query =
        "SELECT * FROM c WHERE c.sessionId = @sessionId ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1";
      const { resources } = await this.containers.collaborationSessions.items
        .query({
          query,
          parameters: [{ name: "@sessionId", value: sessionId }],
        })
        .fetchAll();

      return (resources[0] as CollaborationSession) || null;
    } catch (error) {
      console.error("Failed to get collaboration session:", error);
      throw error;
    }
  }

  /**
   * Get active collaboration sessions by case ID
   */
  async getActiveCollaborationSessions(
    caseId: string
  ): Promise<CollaborationSession[]> {
    if (!this.containers.collaborationSessions) {
      throw new Error("Collaboration sessions container not initialized");
    }

    try {
      const query =
        'SELECT * FROM c WHERE c.caseId = @caseId AND c.status = "active" ORDER BY c.updatedAt DESC';
      const { resources } = await this.containers.collaborationSessions.items
        .query({ query, parameters: [{ name: "@caseId", value: caseId }] })
        .fetchAll();

      return resources as CollaborationSession[];
    } catch (error) {
      console.error("Failed to get active collaboration sessions:", error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: string;
    database: string;
    containers: string[];
    connectionTime: number;
  }> {
    const startTime = Date.now();

    try {
      if (!this.database) {
        await this.initialize();
      }

      const connectionTime = Date.now() - startTime;

      return {
        status: "healthy",
        database: "billigent",
        containers: Object.keys(this.containers).filter(
          (key) => this.containers[key as keyof typeof this.containers] !== null
        ),
        connectionTime,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        database: "billigent",
        containers: [],
        connectionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    try {
      await this.client.dispose();
    } catch (error) {
      console.error("Error closing Cosmos DB client:", error);
    }
  }
}

// Export singleton instance
export const azureCosmosService = new AzureCosmosService();
export default azureCosmosService;
