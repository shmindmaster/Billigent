// Authoritative ICD-10-CM FY2025 source definitions (base + April update)
// Generated with accessibility in mind; user should manually review sources for compliance.
export type Icd10SourceFile = {
  id: string;
  versionLabel: string;
  effectiveStart: string;
  effectiveEnd?: string | null;
  url: string;
  filename: string;
  contentType?: string;
};

// Base (Oct 1 2024 – Mar 31 2025) authoritative ICD-10-CM files
// effectiveEnd is supplied for artifacts superseded by April 1 updates.
export const ICD10_FY2025_BASE: Icd10SourceFile[] = [
  {
    id: "code_tables_tabular_index",
    versionLabel: "FY2025",
    effectiveStart: "2024-10-01",
    effectiveEnd: "2025-03-31",
    url: "https://www.cms.gov/files/zip/2025-code-tables-tabular-and-index.zip",
    filename: "2025-code-tables-tabular-and-index.zip",
  },
  {
    id: "code_descriptions_tabular",
    versionLabel: "FY2025",
    effectiveStart: "2024-10-01",
    effectiveEnd: "2025-03-31",
    url: "https://www.cms.gov/files/zip/2025-code-descriptions-tabular-order.zip",
    filename: "2025-code-descriptions-tabular-order.zip",
  },
  {
    id: "addendum",
    versionLabel: "FY2025",
    effectiveStart: "2024-10-01",
    effectiveEnd: "2025-03-31",
    url: "https://www.cms.gov/files/zip/2025-addendum.zip",
    filename: "2025-addendum.zip",
  },
  {
    id: "conversion_table",
    versionLabel: "FY2025",
    effectiveStart: "2024-10-01",
    // No April change per CMS note; leave open ended for full FY.
    url: "https://www.cms.gov/files/zip/2025-conversion-table.zip",
    filename: "2025-conversion-table.zip",
  },
  {
    id: "poa_exempt",
    versionLabel: "FY2025",
    effectiveStart: "2024-10-01",
    // No April change per CMS note; leave open ended for full FY.
    url: "https://www.cms.gov/files/zip/2025-poa-exempt-codes.zip",
    filename: "2025-poa-exempt-codes.zip",
  },
  {
    id: "official_guidelines_pdf",
    versionLabel: "FY2025",
    effectiveStart: "2024-10-01",
    url: "https://www.cms.gov/files/document/fy-2025-icd-10-cm-coding-guidelines.pdf",
    filename: "fy-2025-icd-10-cm-coding-guidelines.pdf",
    contentType: "application/pdf",
  },
];

// April 1 2025 update set (only these three change; POA & Conversion remain unchanged)
export const ICD10_FY2025_APRIL: Icd10SourceFile[] = [
  {
    id: "april_code_tables_tabular_index",
    versionLabel: "FY2025-April",
    effectiveStart: "2025-04-01",
    url: "https://www.cms.gov/files/zip/2025-code-tables-tabular-and-index-april.zip",
    filename: "2025-code-tables-tabular-and-index-april.zip",
  },
  {
    id: "april_code_descriptions_tabular",
    versionLabel: "FY2025-April",
    effectiveStart: "2025-04-01",
    url: "https://www.cms.gov/files/zip/2025-code-descriptions-tabular-order-april.zip",
    filename: "2025-code-descriptions-tabular-order-april.zip",
  },
  {
    id: "april_addendum",
    versionLabel: "FY2025-April",
    effectiveStart: "2025-04-01",
    url: "https://www.cms.gov/files/zip/2025-icd-10-addendum-april.zip",
    filename: "2025-icd-10-addendum-april.zip",
  },
];

export const ALL_2025_SOURCES: Icd10SourceFile[] = [
  ...ICD10_FY2025_BASE,
  ...ICD10_FY2025_APRIL,
];
