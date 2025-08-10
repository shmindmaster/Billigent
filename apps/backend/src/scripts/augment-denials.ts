// apps/backend/src/scripts/augment-denials.ts
import { randomUUID } from "crypto";
import { format, parse } from "fast-csv";
import fs from "fs";

type Row = Record<string, string>;

// Weighted distribution of common denial reason codes
const CARC = [
  { code: "CO-16", pct: 0.32 }, // Missing/invalid info
  { code: "CO-97", pct: 0.28 }, // Not covered/invalid per benefit
  { code: "PR-1",  pct: 0.18 }, // Deductible
  { code: "CO-50", pct: 0.12 }, // Non-covered services
  { code: "CO-151",pct: 0.10 }, // Payment adjusted due to provider dispute
];

function pickCarc() {
  const r = Math.random();
  let acc = 0;
  for (const c of CARC) { acc += c.pct; if (r <= acc) return c.code; }
  return "CO-97";
}

const DENIAL_RATE = parseFloat(process.env.DENIAL_RATE || "0.12"); // Default 12%
const inPath  = process.env.IN_CSV || "../../synthea_output/csv/claims.csv";
const payerPath = process.env.PAYERS_CSV || "../../synthea_output/csv/payers.csv";
const outPath = process.env.OUT_CSV || "../../synthea_output/csv/medicare_claims.csv";

const payerMap = new Map<string, string>();

console.log(`Reading payers from ${payerPath}...`);
fs.createReadStream(payerPath)
  .pipe(parse({ headers: true }))
  .on("data", (r: Row) => payerMap.set(r["Id"], r["NAME"]))
  .on("end", runTransformation);

function runTransformation() {
  console.log(`Starting claims transformation. Denial rate: ${DENIAL_RATE * 100}%`);
  const inStream = fs.createReadStream(inPath).pipe(parse({ headers: true }));
  const outStream = format({ headers: ["CLAIM_ID", "BENE_ID", "PAYER_NAME", "DENIAL_REASON_CODE", "DENIED_AMOUNT", "TOTAL_COST", "ENCOUNTER_ID", "PRIMARY_DIAGNOSIS"] });
  outStream.pipe(fs.createWriteStream(outPath));

  inStream.on("data", (r: Row) => {
    const total = parseFloat(r["total_claim_cost"] || "0");
    const willDeny = Math.random() < DENIAL_RATE;
    const deniedAmt = willDeny ? Math.min(total, parseFloat((total * (0.05 + Math.random() * 0.25)).toFixed(2))) : 0;
    const payerName = payerMap.get(r["primary_patient_insurance"]) || "Unknown Health Plan";

    const out: Row = {
      CLAIM_ID: r["id"] || `CLM-${randomUUID()}`,
      BENE_ID: r["patient"],
      PAYER_NAME: payerName,
      DENIAL_REASON_CODE: willDeny ? pickCarc() : "",
      DENIED_AMOUNT: deniedAmt.toString(),
      TOTAL_COST: total.toString(),
      ENCOUNTER_ID: r["encounter"],
      PRIMARY_DIAGNOSIS: r["diagnosis1"] || "",
    };
    outStream.write(out);
  });

  inStream.on("end", () => {
    outStream.end();
    console.log(`✅ Transformation complete. Output written to ${outPath}`);
  });
}
