// apps/backend/src/scripts/download-huggingface-dataset.ts
import dotenv from 'dotenv';
import fs from "fs";
import https from "https";
import path from "path";

dotenv.config();

interface AlpacaRecord {
  instruction: string;
  input: string;
  output: string;
  clinical_context?: string;
  icd10_codes?: string[];
}

interface LlamaRecord {
  system: string;
  user: string;
  assistant: string;
  clinical_context?: string;
  icd10_codes?: string[];
}

// Configuration
const DATASET_NAME = process.env.HF_DATASET || "FreedomIntelligence/medical-o1-reasoning-SFT";
const OUTPUT_DIR = path.join(process.cwd(), "../../huggingface_data");
const BATCH_SIZE = 100; // Smaller batches for this high-quality dataset

// Hugging Face API endpoints
const HF_API_BASE = "https://datasets-server.huggingface.co";

async function downloadDatasetInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${HF_API_BASE}/info?dataset=${DATASET_NAME}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse dataset info: ${error}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadDatasetRows(split: string = "train", offset: number = 0, length: number = 100): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${HF_API_BASE}/rows?dataset=${DATASET_NAME}&config=default&split=${split}&offset=${offset}&length=${length}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Failed to parse dataset rows: ${error}`));
        }
      });
    }).on('error', reject);
  });
}

function normalizeRecord(record: any): any {
  // Convert to a standardized format for our RAG system
  return {
    id: record.id || `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    instruction: record.instruction || record.system || "",
    input: record.input || record.user || "",
    output: record.output || record.assistant || "",
    clinical_context: record.clinical_context || "",
    icd10_codes: record.icd10_codes || [],
    source: DATASET_NAME,
    created_at: new Date().toISOString(),
    // Combine all text for embedding generation
    combined_text: [
      record.instruction || record.system || "",
      record.input || record.user || "",
      record.output || record.assistant || "",
      record.clinical_context || ""
    ].filter(Boolean).join(" ")
  };
}

async function ensureOutputDirectory(): Promise<void> {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
}

async function saveRecordsBatch(records: any[], batchNumber: number): Promise<string> {
  const filename = path.join(OUTPUT_DIR, `batch_${batchNumber.toString().padStart(4, '0')}.json`);
  
  await fs.promises.writeFile(filename, JSON.stringify(records, null, 2));
  
  console.log(`💾 Saved ${records.length} records to ${filename}`);
  return filename;
}

async function createManifest(totalRecords: number, totalBatches: number, filePaths: string[]): Promise<void> {
  const manifest = {
    dataset: DATASET_NAME,
    download_date: new Date().toISOString(),
    total_records: totalRecords,
    total_batches: totalBatches,
    batch_size: BATCH_SIZE,
    files: filePaths.map(fp => path.basename(fp)),
    schema: {
      id: "string",
      instruction: "string", 
      input: "string",
      output: "string",
      clinical_context: "string",
      icd10_codes: "array",
      source: "string",
      created_at: "string",
      combined_text: "string"
    }
  };
  
  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`📋 Created manifest: ${manifestPath}`);
}

async function main() {
  try {
    console.log("🤗 Starting Hugging Face dataset download...");
    console.log(`📊 Dataset: ${DATASET_NAME}`);
    
    // Ensure output directory exists
    await ensureOutputDirectory();
    
    // Get dataset information
    console.log("🔍 Fetching dataset information...");
    const datasetInfo = await downloadDatasetInfo();
    
    console.log(`📈 Dataset info:`, {
      splits: datasetInfo.dataset_info?.splits || "Unknown",
      features: Object.keys(datasetInfo.dataset_info?.features || {}),
      size: datasetInfo.dataset_info?.download_size || "Unknown"
    });
    
    // Determine the split to use (usually 'train')
    const splits = Object.keys(datasetInfo.dataset_info?.splits || { train: {} });
    const splitToUse = splits.includes('train') ? 'train' : splits[0];
    
    console.log(`📝 Using split: ${splitToUse}`);
    
    // Download dataset in batches
    let offset = 0;
    let batchNumber = 1;
    let totalRecords = 0;
    const filePaths: string[] = [];
    
    while (true) {
      console.log(`📥 Downloading batch ${batchNumber} (offset: ${offset})...`);
      
      const response = await downloadDatasetRows(splitToUse, offset, BATCH_SIZE);
      
      if (!response.rows || response.rows.length === 0) {
        console.log("✅ Reached end of dataset");
        break;
      }
      
      // Normalize records for our system
      const normalizedRecords = response.rows.map(normalizeRecord);
      
      // Save batch to file
      const filePath = await saveRecordsBatch(normalizedRecords, batchNumber);
      filePaths.push(filePath);
      
      totalRecords += normalizedRecords.length;
      offset += BATCH_SIZE;
      batchNumber++;
      
      console.log(`📊 Progress: ${totalRecords} records downloaded`);
      
      // Rate limiting to be respectful to HF servers
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Safety limit for testing - remove or increase for production
      if (totalRecords >= 10000) {
        console.log("🛑 Reached safety limit of 10,000 records");
        break;
      }
    }
    
    // Create manifest file
    await createManifest(totalRecords, batchNumber - 1, filePaths);
    
    console.log(`✅ Download complete!`);
    console.log(`   📄 Total records: ${totalRecords.toLocaleString()}`);
    console.log(`   📦 Total batches: ${batchNumber - 1}`);
    console.log(`   📁 Output directory: ${OUTPUT_DIR}`);
    console.log(`   🚀 Ready for Azure Data Lake upload!`);
    
  } catch (error) {
    console.error("❌ Download failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { downloadDatasetRows, normalizeRecord };

