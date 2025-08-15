// PURGED: Removed Prisma-backed FHIR resource service.
export interface FhirResourceRecord {
  id: string;
  resourceType: string;
  patientId?: string | null;
  encounterId?: string | null;
  json: any;
  createdAt: string;
}

class FhirResourceServiceClass {
  private items: FhirResourceRecord[] = [];

  async listByType(
    resourceType: string,
    opts: {
      patientId?: string;
      encounterId?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const { patientId, encounterId, limit = 100, offset = 0 } = opts;
    let filtered = this.items.filter((i) => i.resourceType === resourceType);
    if (patientId) filtered = filtered.filter((i) => i.patientId === patientId);
    if (encounterId)
      filtered = filtered.filter((i) => i.encounterId === encounterId);
    const total = filtered.length;
    return { items: filtered.slice(offset, offset + limit), total };
  }

  async listByPatient(
    patientId: string,
    opts: { resourceType?: string; limit?: number; offset?: number }
  ) {
    const { resourceType, limit = 100, offset = 0 } = opts;
    let filtered = this.items.filter((i) => i.patientId === patientId);
    if (resourceType)
      filtered = filtered.filter((i) => i.resourceType === resourceType);
    const total = filtered.length;
    return { items: filtered.slice(offset, offset + limit), total };
  }

  async upsert(input: { resourceType: string; resource: any }) {
    const rec: FhirResourceRecord = {
      id: `${input.resourceType}:${Date.now()}:${Math.random()
        .toString(36)
        .slice(2)}`,
      resourceType: input.resourceType,
      patientId: input.resource?.patient?.reference || null,
      encounterId: input.resource?.encounter?.reference || null,
      json: input.resource,
      createdAt: new Date().toISOString(),
    };
    this.items.push(rec);
    return rec;
  }
}

export const FhirResourceService = new FhirResourceServiceClass();
export default FhirResourceService;
