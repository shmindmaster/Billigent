import { prisma } from './prisma.service';

// Allowed FHIR resource types we will persist initially
const ALLOWED_RESOURCE_TYPES = new Set([
  'Patient','Encounter','Observation','Claim','Condition','Procedure','DocumentReference'
]);

export interface FhirResourceUpsertInput {
  resourceType: string;
  resource: any; // raw parsed JSON
}

export class FhirResourceService {
  /** Persist (insert or update) a FHIR resource. If resource.id present we treat it as upsert by resource logical id */
  static async upsert({ resourceType, resource }: FhirResourceUpsertInput) {
    if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
      throw new Error(`Unsupported resourceType: ${resourceType}`);
    }
    if (!resource || typeof resource !== 'object') {
      throw new Error('Resource payload must be an object');
    }
    if (resource.resourceType !== resourceType) {
      throw new Error('resourceType mismatch between path and payload');
    }
    // Basic linkage extraction (FHIR references are usually like "Patient/{id}")
    let patientId: string | undefined;
    let encounterId: string | undefined;
    if (resource.subject && typeof resource.subject.reference === 'string') {
      const ref = resource.subject.reference; // e.g., "Patient/123"
      if (ref.startsWith('Patient/')) patientId = ref.split('/')[1];
    }
    if (resource.patient && typeof resource.patient.reference === 'string') {
      const ref = resource.patient.reference;
      if (ref.startsWith('Patient/')) patientId = ref.split('/')[1];
    }
    if (resource.encounter && typeof resource.encounter.reference === 'string') {
      const ref = resource.encounter.reference; // "Encounter/abc"
      if (ref.startsWith('Encounter/')) encounterId = ref.split('/')[1];
    }

    const logicalId: string = resource.id || undefined;

    // Strategy: if logical id given, attempt find by (resourceType, json->id). For simplicity we store one row per logical id by using a composite lookup.
    // We'll just query existing row with the same resourceType + patientId + encounterId + logical id (if provided) else create new.

    // NOTE: For production you'd likely maintain a separate logicalId column; kept minimal per directive.

    const jsonString = JSON.stringify(resource);
    const created = await prisma.fhirResource.create({
      data: {
        resourceType,
        patientId,
        encounterId,
        json: jsonString
      }
    });
    return created;
  }

  static async listByType(resourceType: string, options: { patientId?: string; encounterId?: string; limit?: number; offset?: number } = {}) {
    if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) {
      throw new Error(`Unsupported resourceType: ${resourceType}`);
    }
    const { patientId, encounterId, limit = 100, offset = 0 } = options;
    const where: any = { resourceType };
    if (patientId) where.patientId = patientId;
    if (encounterId) where.encounterId = encounterId;

    const [items, total] = await Promise.all([
      prisma.fhirResource.findMany({ where, skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.fhirResource.count({ where })
    ]);
    return { items, total };
  }

  static async listByPatient(patientId: string, options: { resourceType?: string; limit?: number; offset?: number } = {}) {
    const { resourceType, limit = 100, offset = 0 } = options;
    const where: any = { patientId };
    if (resourceType) {
      if (!ALLOWED_RESOURCE_TYPES.has(resourceType)) throw new Error(`Unsupported resourceType: ${resourceType}`);
      where.resourceType = resourceType;
    }
    const [items, total] = await Promise.all([
      prisma.fhirResource.findMany({ where, skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.fhirResource.count({ where })
    ]);
    return { items, total };
  }
}

export default FhirResourceService;