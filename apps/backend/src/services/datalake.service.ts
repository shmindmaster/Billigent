import dotenv from 'dotenv';
dotenv.config();
import { DataLakeServiceClient, StorageSharedKeyCredential } from '@azure/storage-file-datalake';

type FhirResource = Record<string, any>;

function getEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

/**
 * Fetch FHIR resources from Azure Data Lake linked to a given encounterFhirId.
 * Looks under a path like {filesystem}/{baseDir}/{resourceType}/.../*.json and filters by encounter reference.
 */
export async function getClinicalEvidence(encounterFhirId: string): Promise<FhirResource[]> {
  if (!encounterFhirId) return [];

  const accountName = process.env.AZURE_STORAGE_ACCOUNT || 'billigentdevdlseus2';
  const fileSystemName = process.env.AZURE_STORAGE_FILESYSTEM || 'data';
  const baseDir = process.env.AZURE_STORAGE_FHIR_DIR || 'silver/fhir';

  const accountKey = getEnv('AZURE_STORAGE_KEY');
  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  const dfsEndpoint = `https://${accountName}.dfs.core.windows.net`;
  const serviceClient = new DataLakeServiceClient(dfsEndpoint, credential);
  const fileSystemClient = serviceClient.getFileSystemClient(fileSystemName);

  const resourceTypes = (process.env.FHIR_RESOURCE_TYPES || 'Observation,Condition,Procedure,DiagnosticReport,MedicationRequest,AllergyIntolerance,Encounter').split(',');

  const results: FhirResource[] = [];
  const encountered = new Set<string>();

  for (const type of resourceTypes) {
    const dirClient = fileSystemClient.getDirectoryClient(`${baseDir}/${type}`);
    try {
      // Iterate files by listing subpaths using fileSystem since directory client lacks list on some SDK versions
      const pathPrefix = `${baseDir}/${type}`.replace(/\/+/, '/');
      for await (const item of fileSystemClient.listPaths({ path: pathPrefix, recursive: true })) {
        if (item.isDirectory) continue;
        const name = item.name || '';
        if (!name.toLowerCase().endsWith('.json')) continue;
        // Quick path filter when the filename contains the encounter id
        if (name.includes(encounterFhirId) === false) {
          // Still allow; many FHIR files won't embed encounter in filename
        }

        const fileClient = fileSystemClient.getFileClient(name);
        const download = await fileClient.read();
        const chunks: Uint8Array[] = [];
        const reader = download.readableStreamBody;
        if (!reader) continue;
        await new Promise<void>((resolve, reject) => {
          reader.on('data', (d: Uint8Array) => chunks.push(Buffer.from(d)));
          reader.on('end', () => resolve());
          reader.on('error', reject);
        });
        const raw = Buffer.concat(chunks).toString('utf-8');
        try {
          const obj = JSON.parse(raw);
          // Filter: resource.encounter.reference may be like 'Encounter/12345'
          const encounterRef: string | undefined = obj?.encounter?.reference || obj?.context?.reference;
          const matches = typeof encounterRef === 'string' && encounterRef.includes(encounterFhirId);
          if (matches) {
            const id = obj?.id ? `${type}:${obj.id}` : name;
            if (!encountered.has(id)) {
              results.push(obj);
              encountered.add(id);
            }
          }
        } catch {
          // ignore parse errors
        }
      }
    } catch {
      // Ignore missing directories for a given resource type
      continue;
    }
  }

  return results;
}


