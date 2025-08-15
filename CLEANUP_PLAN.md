# Codebase Cleanup Plan

## Summary
- Total issues found: 525
- High priority: 205
- Medium priority: 313
- Low priority: 7

## Issues by Type
- console: 313
- any: 205
- todo: 7

## Detailed Issues

### scripts\seed-working-sets.ts

- **Line 2** (MEDIUM): Console statement: console.log('seed-working-sets script removed - implement Cosmos data population if required.');

### scripts\run-ai-search-population.ts

- **Line 68** (HIGH): Any type usage: } catch (buildError: any) {
- **Line 95** (MEDIUM): Console statement: console.log(stdout);
- **Line 100** (MEDIUM): Console statement: console.warn(stderr);
- **Line 106** (HIGH): Any type usage: } catch (error: any) {
- **Line 164** (MEDIUM): Console statement: console.log(`

### scripts\dump-env.js

- **Line 2** (MEDIUM): Console statement: console.log('Node executable:', process.execPath);
- **Line 3** (MEDIUM): Console statement: console.log('Platform:', process.platform, 'Arch:', process.arch);
- **Line 4** (MEDIUM): Console statement: console.log('PATH entries:');
- **Line 5** (MEDIUM): Console statement: (process.env.PATH || '').split(process.platform === 'win32' ? ';' : ':').forEach(p => console.log('  -', p));

### scripts\convert-to-parquet.ts

- **Line 82** (HIGH): Any type usage: con.run(sql, (err: any) => (err ? reject(err) : resolve()));
- **Line 94** (MEDIUM): Console statement: console.log(JSON.stringify({ status: 'ok', src, dst, url: `${baseUrl}/${container}/${encodeURI(dst)}` }));
- **Line 98** (MEDIUM): Console statement: console.error(e);

### scripts\cleanup-non-functional.ts

- **Line 42** (MEDIUM): Console statement: console.log("🔍 Scanning codebase for cleanup opportunities...");
- **Line 68** (MEDIUM): Console statement: if (line.includes("console.log") || line.includes("console.warn") || line.includes("console.error")) {
- **Line 79** (LOW): TODO/FIXME item: if (line.includes("TODO:") || line.includes("FIXME:") || line.includes("HACK:") || line.includes("XXX:")) {
- **Line 90** (HIGH): Any type usage: if (line.includes(": any") || line.includes("as any")) {
- **Line 100** (HIGH): TypeScript directive: // Check for @ts-ignore and @ts-nocheck
- **Line 101** (HIGH): TypeScript directive: if (line.includes("@ts-ignore") || line.includes("@ts-nocheck")) {
- **Line 112** (MEDIUM): Console statement: console.warn(`Warning: Could not analyze file ${relativePath}:`, error);
- **Line 182** (HIGH): TypeScript directive: plan += `- Remove @ts-ignore and @ts-nocheck directives\n`;
- **Line 199** (MEDIUM): Console statement: console.log(`📝 Cleanup plan saved to: ${outputPath}`);
- **Line 211** (MEDIUM): Console statement: console.log("✅ Cleanup analysis complete!");
- **Line 212** (MEDIUM): Console statement: console.log("📋 Review CLEANUP_PLAN.md for detailed recommendations");
- **Line 215** (MEDIUM): Console statement: console.error("❌ Cleanup analysis failed:", error);
- **Line 221** (MEDIUM): Console statement: main().catch(console.error);

### apps\backend\test-startup.js

- **Line 4** (MEDIUM): Console statement: console.log('🚀 Testing Backend Startup...');
- **Line 19** (MEDIUM): Console statement: console.log('📤 STDOUT:', message.trim());
- **Line 22** (MEDIUM): Console statement: console.log('✅ Backend started successfully!');
- **Line 31** (MEDIUM): Console statement: console.error('❌ STDERR:', message.trim());
- **Line 35** (MEDIUM): Console statement: console.error('❌ Process error:', error);
- **Line 39** (MEDIUM): Console statement: console.log(`\n📊 Process exited with code ${code}`);
- **Line 40** (MEDIUM): Console statement: console.log('\n📋 Full output:');
- **Line 41** (MEDIUM): Console statement: console.log(output);
- **Line 44** (MEDIUM): Console statement: console.log('\n❌ Errors:');
- **Line 45** (MEDIUM): Console statement: console.log(errorOutput);
- **Line 49** (MEDIUM): Console statement: console.log('\n❌ Backend failed to start properly');
- **Line 56** (MEDIUM): Console statement: console.log('⏰ Startup timeout - killing process');

### apps\frontend\src\main.tsx

- **Line 14** (MEDIUM): Console statement: console.log('SW registered: ', registration);
- **Line 17** (MEDIUM): Console statement: console.log('SW registration failed: ', registrationError);

### apps\frontend\src\App.tsx

- **Line 31** (MEDIUM): Console statement: console.warn('Page loading timeout - this might indicate a performance issue');
- **Line 66** (MEDIUM): Console statement: console.error('App-level error:', error, errorInfo);

### apps\backend\src\global.d.ts

- **Line 6** (HIGH): Any type usage: constructor(config: any);
- **Line 7** (HIGH): Any type usage: database(id: string): any;
- **Line 16** (HIGH): Any type usage: export const Connection: any;
- **Line 17** (HIGH): Any type usage: export const Request: any;
- **Line 18** (HIGH): Any type usage: export const ConnectionPool: any;
- **Line 19** (HIGH): Any type usage: export const config: any;
- **Line 25** (HIGH): Any type usage: getFileSystemClient(name: string): any;
- **Line 32** (HIGH): Any type usage: constructor(endpoint: string, index: string, credential: any);
- **Line 33** (HIGH): Any type usage: search(query: string, opts?: any): AsyncIterable<any>;
- **Line 34** (HIGH): Any type usage: uploadDocuments(docs: any[]): Promise<any>;

### apps\backend\scripts\run-tests.js

- **Line 8** (MEDIUM): Console statement: console.error(
- **Line 27** (MEDIUM): Console statement: console.error(`Test failed: ${file}`);
- **Line 28** (MEDIUM): Console statement: console.error(err);
- **Line 36** (MEDIUM): Console statement: console.log(`\nTest summary: ${passed} passed, ${failed} failed`);

### apps\backend\scripts\optimize-cosmos.ts

- **Line 128** (HIGH): Any type usage: private analyzePartitionKey(containerId: string, currentPartitionKey: any): {
- **Line 323** (MEDIUM): Console statement: main().catch(console.error);

### apps\backend\scripts\normalize-citations.ts

- **Line 22** (MEDIUM): Console statement: console.error(`Corpus file missing at ${corpusPath}`);
- **Line 33** (MEDIUM): Console statement: console.log(JSON.stringify(summary, null, 2));
- **Line 37** (MEDIUM): Console statement: console.error('Normalization failed', err);

### apps\backend\scripts\icd10cm-util.ts

- **Line 8** (HIGH): TypeScript directive: // @ts-ignore
- **Line 28** (HIGH): Any type usage: await pipeline(res.body as any, file);
- **Line 40** (HIGH): Any type usage: directory.files.map(async (file: any) => {

### apps\backend\scripts\icd10cm-upload.ts

- **Line 102** (HIGH): Any type usage: let ents: any[] = [];
- **Line 124** (MEDIUM): Console statement: console.log("[icd10cm-upload] INGEST_UPLOAD not set; skipping.");
- **Line 155** (MEDIUM): Console statement: console.log(`[icd10cm-upload] raw -> ${rawFs}:${dest}`);
- **Line 159** (MEDIUM): Console statement: console.warn("[icd10cm-upload] no raw directory present");
- **Line 167** (MEDIUM): Console statement: console.log(`[icd10cm-upload] manifest -> ${rawFs}:${dest}`);
- **Line 178** (MEDIUM): Console statement: console.log(`[icd10cm-upload] normalized -> ${curatedFs}:${dest}`);
- **Line 182** (MEDIUM): Console statement: console.warn("[icd10cm-upload] no normalized directory present");
- **Line 196** (MEDIUM): Console statement: console.log("[icd10cm-upload] cleaned local raw/work");
- **Line 210** (MEDIUM): Console statement: console.log(`[icd10cm-upload] dataset_hash.json -> ${curatedFs}:${dest}`);
- **Line 214** (MEDIUM): Console statement: console.log("[icd10cm-upload] complete");
- **Line 218** (MEDIUM): Console statement: console.error(e);

### apps\backend\scripts\icd10cm-parse.ts

- **Line 165** (MEDIUM): Console statement: console.log(`[icd10cm-parse] extracting ${f}`);
- **Line 320** (MEDIUM): Console statement: console.warn(
- **Line 352** (MEDIUM): Console statement: console.warn(
- **Line 557** (MEDIUM): Console statement: console.log(
- **Line 561** (MEDIUM): Console statement: console.warn(
- **Line 566** (MEDIUM): Console statement: console.warn(
- **Line 700** (MEDIUM): Console statement: console.log(`[icd10cm-parse] Wrote normalized dataset rows=${rows.length}`);
- **Line 702** (MEDIUM): Console statement: console.log(`[icd10cm-parse] change log entries=${changeLog.length}`);
- **Line 704** (MEDIUM): Console statement: console.warn(
- **Line 710** (MEDIUM): Console statement: console.error(e);

### apps\backend\scripts\icd10cm-download.ts

- **Line 72** (MEDIUM): Console statement: console.log(`[icd10cm-download] skip existing ${src.filename}`);
- **Line 75** (MEDIUM): Console statement: console.log(`[icd10cm-download] downloading ${src.url}`);
- **Line 82** (MEDIUM): Console statement: console.log("No files processed.");
- **Line 97** (MEDIUM): Console statement: console.log(`[icd10cm-download] Wrote manifest entries=${manifest.length}`);
- **Line 101** (MEDIUM): Console statement: console.error(e);

### apps\backend\scripts\adls-ops.ts

- **Line 28** (HIGH): Any type usage: const streamPipeline = promisify(pipeline as any);
- **Line 72** (MEDIUM): Console statement: console.log(`[adls-ops] Auth: SharedKey for account ${account}`);
- **Line 79** (MEDIUM): Console statement: console.log(`[adls-ops] Auth: DefaultAzureCredential for ${dfsEndpoint}`);
- **Line 87** (MEDIUM): Console statement: console.log(`[adls-ops] Auth: ConnectionString`);
- **Line 109** (HIGH): Any type usage: function toCsv(rows: any[]): string {
- **Line 174** (HIGH): Any type usage: await streamPipeline(body, hash as any);
- **Line 202** (MEDIUM): Console statement: console.log(`Wrote inventory_pre.csv to ${dataFS}/${opsDir}`);
- **Line 203** (MEDIUM): Console statement: console.log(`[adls-ops] Local artifact: ${localDir}\\inventory_pre.csv`);
- **Line 246** (MEDIUM): Console statement: console.log(`Wrote move_plan.csv to ${dataFS}/${opsDir}`);
- **Line 247** (MEDIUM): Console statement: console.log(`[adls-ops] Local artifact: ${localDir}\\move_plan.csv`);
- **Line 326** (HIGH): Any type usage: const verRows: any[] = [];
- **Line 353** (HIGH): Any type usage: } catch (e: any) {
- **Line 370** (MEDIUM): Console statement: console.log(`Wrote copy_verify.csv to ${dataFS}/${opsDir}`);
- **Line 371** (MEDIUM): Console statement: console.log(`[adls-ops] Local artifact: ${localDir}\\copy_verify.csv`);
- **Line 385** (HIGH): Any type usage: function parseCsv(text: string): any[] {
- **Line 389** (HIGH): Any type usage: const rows: any[] = [];
- **Line 392** (HIGH): Any type usage: const obj: any = {};
- **Line 424** (MEDIUM): Console statement: console.log("Usage: tsx adls-ops.ts <inventory|move-plan|copy-verify>");
- **Line 433** (MEDIUM): Console statement: console.error(e);

### apps\frontend\src\services\performanceApi.service.ts

- **Line 51** (MEDIUM): Console statement: console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
- **Line 57** (MEDIUM): Console statement: console.error('Request interceptor error:', error);
- **Line 69** (MEDIUM): Console statement: console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
- **Line 88** (MEDIUM): Console statement: console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
- **Line 129** (MEDIUM): Console statement: console.log(`🔄 Retrying request (attempt ${config.retryAttempt}/${this.config.retryAttempts}) in ${delay}ms`);
- **Line 147** (HIGH): Any type usage: private formatError(error: AxiosError, duration: number): any {
- **Line 235** (HIGH): Any type usage: async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
- **Line 245** (HIGH): Any type usage: async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {

### apps\frontend\src\services\fhirService.ts

- **Line 5** (HIGH): Any type usage: clinicalDocuments: any[];

### apps\frontend\src\services\evidenceService.ts

- **Line 101** (HIGH): Any type usage: fired: any[];
- **Line 107** (HIGH): Any type usage: payload: any;
- **Line 195** (HIGH): Any type usage: relevantDocuments: any[];
- **Line 224** (HIGH): Any type usage: results: any[];
- **Line 255** (HIGH): Any type usage: results: any[];
- **Line 301** (MEDIUM): Console statement: console.error('Failed to build evidence bundle:', error);
- **Line 328** (MEDIUM): Console statement: console.error('Failed to get evidence summary:', error);

### apps\frontend\src\services\citationService.ts

- **Line 84** (MEDIUM): Console statement: console.error('Failed to fetch citation health:', error);
- **Line 97** (MEDIUM): Console statement: console.error('Failed to fetch citation analytics:', error);
- **Line 110** (MEDIUM): Console statement: console.error('Failed to fetch citation statistics:', error);
- **Line 129** (MEDIUM): Console statement: console.error('Failed to fetch citations:', error);
- **Line 142** (MEDIUM): Console statement: console.error(`Failed to fetch citation ${id}:`, error);
- **Line 155** (MEDIUM): Console statement: console.error('Failed to analyze citation coverage:', error);
- **Line 163** (HIGH): Any type usage: async analyzeEvidenceQuality(evidenceBundle: any) {
- **Line 168** (MEDIUM): Console statement: console.error('Failed to analyze evidence quality:', error);

### apps\frontend\src\services\api.service.ts

- **Line 20** (MEDIUM): Console statement: console.warn('API error:', error.response.data.error);

### apps\frontend\src\pages\Settings.tsx

- **Line 29** (MEDIUM): Console statement: console.log('Settings saved:', settings);

### apps\frontend\src\pages\QueryManagement.tsx

- **Line 80** (MEDIUM): Console statement: console.error('Error fetching queries:', error);
- **Line 122** (MEDIUM): Console statement: console.error('Error submitting query:', error);

### apps\frontend\src\pages\PreBillReview.tsx

- **Line 79** (MEDIUM): Console statement: console.error('Error fetching cases:', error);
- **Line 98** (MEDIUM): Console statement: console.error('Error analyzing case:', error);
- **Line 155** (MEDIUM): Console statement: console.log('Enhanced CDI analysis completed:', result);

### apps\frontend\src\pages\DenialsManagement.tsx

- **Line 87** (HIGH): Any type usage: const data = result?.data as any;
- **Line 99** (MEDIUM): Console statement: console.error('Error polling for analysis results:', error);
- **Line 190** (HIGH): Any type usage: const analysisId = (startResult?.data as any)?.analysisId as string | undefined;
- **Line 200** (MEDIUM): Console statement: console.error('Error starting file analysis:', error);
- **Line 238** (MEDIUM): Console statement: console.log('Finalizing appeal for:', selectedDenial.claimId);
- **Line 239** (MEDIUM): Console statement: console.log('Appeal letter:', appealLetter);

### apps\frontend\src\pages\CaseView.tsx

- **Line 105** (HIGH): Any type usage: <p className={`font-semibold ${bodyClass}`}>{caseData.admissionDate ? formatDate(caseData.admissionDate as any) : 'N/A'}</p>
- **Line 106** (HIGH): Any type usage: <p className={`text-sm ${secondaryTextClass}`}>Discharge: {caseData.dischargeDate ? formatDate(caseData.dischargeDate as any) : 'N/A'}</p>

### apps\frontend\src\pages\CaseReview.tsx

- **Line 57** (MEDIUM): Console statement: console.error(e);
- **Line 91** (HIGH): Any type usage: const response = await getConversationalResponse(currentQuestion as any);
- **Line 99** (HIGH): Any type usage: .filter((item: any) => item.type === 'text')
- **Line 100** (HIGH): Any type usage: .map((item: any) => item.text)
- **Line 119** (MEDIUM): Console statement: console.error('Error getting conversational response:', error);
- **Line 141** (HIGH): Any type usage: const handleRuleTrigger = (event: any) => {
- **Line 142** (MEDIUM): Console statement: console.log('KPI Rule triggered:', event);
- **Line 149** (MEDIUM): Console statement: console.log('View evidence for case:', caseId);
- **Line 154** (MEDIUM): Console statement: console.log('Generate appeal for case:', caseId);
- **Line 252** (HIGH): Any type usage: <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-6`}>{typeof error === 'string' ? error : (error as any)?.message || 'The requested case could not be found.'}</p>
- **Line 471** (HIGH): Any type usage: ? Math.round(caseData.evidence.reduce((sum: number, ev: any) => sum + ev.relevanceScore, 0) / caseData.evidence.length)

### apps\frontend\src\pages\CaseManagement.tsx

- **Line 29** (HIGH): Any type usage: const activeCases = cases.filter((c: any) => c.status === 'open').length;
- **Line 30** (HIGH): Any type usage: const reviewNeeded = cases.filter((c: any) => c.status === 'review').length;
- **Line 79** (HIGH): Any type usage: render: (_: any, row: any) => (
- **Line 92** (HIGH): Any type usage: render: (_: any, row: any) => (
- **Line 102** (HIGH): Any type usage: render: (_: any, row: any) => row.admissionDate ? formatDate(row.admissionDate) : '—'
- **Line 107** (HIGH): Any type usage: render: (_: any, row: any) => (
- **Line 116** (HIGH): Any type usage: render: (_: any, row: any) => (
- **Line 130** (HIGH): Any type usage: render: (_: any, row: any) => '—'
- **Line 135** (HIGH): Any type usage: render: (_: any, row: any) => (
- **Line 160** (HIGH): Any type usage: filtered = filtered.filter((c: any) => c.status === statusFilter);
- **Line 164** (HIGH): Any type usage: filtered = filtered.filter((c: any) => c.priority === priorityFilter);

### apps\frontend\src\pages\Analytics.tsx

- **Line 48** (HIGH): Any type usage: message={typeof error === 'string' ? error : (error as any)?.message || 'Failed to load analytics data'}

### apps\frontend\src\lib\responses-api.ts

- **Line 3** (HIGH): Any type usage: const RESPONSES_ENDPOINT = (import.meta as any)?.env?.VITE_AZURE_OPENAI_RESPONSES_ENDPOINT || '';
- **Line 4** (HIGH): Any type usage: const RESPONSES_API_KEY = (import.meta as any)?.env?.VITE_AZURE_OPENAI_API_KEY || '';
- **Line 12** (HIGH): Any type usage: content?: Array<{ type: string; text?: string; [key: string]: any }>;

### apps\frontend\src\providers\QueryProvider.tsx

- **Line 24** (LOW): TODO/FIXME item: submitQuery: async () => { /* TODO: Implement */ },
- **Line 26** (LOW): TODO/FIXME item: refreshQueries: async () => { /* TODO: Implement */ }

### apps\frontend\src\hooks\useData.ts

- **Line 162** (HIGH): Any type usage: return useMutation<DbQuery, unknown, { question: string; userId: string; context?: any }>({
- **Line 194** (HIGH): Any type usage: error: error as any,

### apps\backend\src\workflows\pre-bill.workflow.ts

- **Line 2** (HIGH): Any type usage: export interface PreBillAnalysisResult { encounterId: string; confidence: number; recommendations: any; riskFactors: string[]; notes: string; }

### apps\backend\src\workflows\cdi-enhanced.workflow.ts

- **Line 39** (HIGH): Any type usage: context?: any
- **Line 59** (HIGH): Any type usage: _filters?: any

### apps\backend\src\types\azureCosmos.service.d.ts

- **Line 2** (HIGH): Any type usage: export const azureCosmosService: any;

### apps\backend\src\tests\metrics.snapshot.test.ts

- **Line 23** (MEDIUM): Console statement: console.log("Metrics snapshot test passed");

### apps\backend\src\tests\denials.baseline.test.ts

- **Line 11** (MEDIUM): Console statement: console.log("Denials baseline metrics test passed");

### apps\backend\src\tests\citation.normalization.test.ts

- **Line 46** (MEDIUM): Console statement: console.warn("Corpus file missing; skipping citation normalization test");
- **Line 70** (MEDIUM): Console statement: console.log("Citation normalization test passed", {

### apps\backend\src\tests\citation.duplicates.test.ts

- **Line 53** (MEDIUM): Console statement: console.log("Citation duplicate detection test passed");

### apps\backend\src\tests\citation.coverage.test.ts

- **Line 13** (MEDIUM): Console statement: console.log('Citation coverage route test passed');

### apps\backend\src\tests\citation.classification.test.ts

- **Line 56** (MEDIUM): Console statement: console.log("Citation classification test passed");

### apps\backend\src\strategy\kpiRulesDsl.ts

- **Line 70** (HIGH): Any type usage: export function evaluate(rule: DslRule, metrics: Record<string, number>, emit: (eventType: string, payload: any) => void) {

### apps\backend\src\strategy\evidenceGraph.ts

- **Line 111** (MEDIUM): Console statement: console.warn('Failed to load citations:', error);

### apps\backend\src\strategy\citations.ts

- **Line 13** (HIGH): Any type usage: [k: string]: any; // allow future fields

### apps\backend\src\services\responses-api.service.ts

- **Line 16** (HIGH): Any type usage: data?: any;
- **Line 19** (HIGH): Any type usage: result?: any;
- **Line 26** (HIGH): Any type usage: patientContext?: any;
- **Line 27** (HIGH): Any type usage: clinicalData?: any;
- **Line 45** (MEDIUM): Console statement: console.warn('[ResponsesAPIService] Disabled: missing Azure OpenAI env vars');
- **Line 106** (MEDIUM): Console statement: console.error('ResponsesAPIService error:', error);
- **Line 134** (MEDIUM): Console statement: console.error('Error getting conversational response:', error);
- **Line 185** (MEDIUM): Console statement: console.error('Background analysis error:', error);
- **Line 196** (MEDIUM): Console statement: console.error('Error starting background analysis:', error);
- **Line 227** (HIGH): Any type usage: dataContext?: any
- **Line 291** (HIGH): Any type usage: denialDetails: any,
- **Line 292** (HIGH): Any type usage: patientData?: any,
- **Line 293** (HIGH): Any type usage: clinicalEvidence?: any

### apps\backend\src\services\rag.service.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 67** (MEDIUM): Console statement: console.warn(
- **Line 104** (MEDIUM): Console statement: console.error("Error generating embedding:", error);
- **Line 114** (MEDIUM): Console statement: console.log(`Index ${this.config.searchIndexName} already exists`);
- **Line 115** (HIGH): Any type usage: } catch (error: any) {
- **Line 117** (MEDIUM): Console statement: console.log(`Creating index ${this.config.searchIndexName}...`);
- **Line 186** (MEDIUM): Console statement: console.log(
- **Line 193** (MEDIUM): Console statement: console.error("Error checking/creating index:", error);
- **Line 242** (MEDIUM): Console statement: console.error("Error searching documents:", error);
- **Line 294** (MEDIUM): Console statement: console.error("Error generating response:", error);
- **Line 316** (MEDIUM): Console statement: console.error("Error in RAG query:", error);
- **Line 348** (MEDIUM): Console statement: console.log(`Document ${document.id} indexed successfully`);
- **Line 350** (MEDIUM): Console statement: console.error("Error indexing document:", error);
- **Line 367** (MEDIUM): Console statement: console.log(`Generating embeddings for ${documents.length} documents...`);
- **Line 388** (MEDIUM): Console statement: console.log(
- **Line 395** (MEDIUM): Console statement: console.log(`Successfully indexed ${documents.length} documents`);
- **Line 397** (MEDIUM): Console statement: console.error("Error batch indexing documents:", error);
- **Line 407** (HIGH): Any type usage: context?: any
- **Line 414** (MEDIUM): Console statement: console.error("Error getting grounded ICD response:", error);
- **Line 422** (HIGH): Any type usage: encounter?: any
- **Line 444** (MEDIUM): Console statement: console.error("Error getting CDI recommendations:", error);

### apps\backend\src\services\fhirResource.service.ts

- **Line 7** (HIGH): Any type usage: json: any;
- **Line 44** (HIGH): Any type usage: async upsert(input: { resourceType: string; resource: any }) {

### apps\backend\src\services\fhirDataIngestion.service.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 19** (HIGH): Any type usage: [key: string]: any;
- **Line 64** (HIGH): Any type usage: [key: string]: any;
- **Line 165** (MEDIUM): Console statement: console.error(errorMessage);
- **Line 182** (MEDIUM): Console statement: console.error(errorMessage);
- **Line 209** (MEDIUM): Console statement: console.warn(
- **Line 280** (MEDIUM): Console statement: console.warn(
- **Line 348** (MEDIUM): Console statement: console.error("Failed to parse FHIR content:", error);
- **Line 453** (MEDIUM): Console statement: console.warn("Failed to generate embeddings:", error);
- **Line 473** (MEDIUM): Console statement: console.error(
- **Line 508** (HIGH): Any type usage: private generatePatientContent(patient: any): string {
- **Line 522** (HIGH): Any type usage: private generateEncounterContent(encounter: any): string {
- **Line 536** (HIGH): Any type usage: private generateObservationContent(observation: any): string {
- **Line 553** (HIGH): Any type usage: private generateConditionContent(condition: any): string {
- **Line 566** (HIGH): Any type usage: private generateProcedureContent(procedure: any): string {
- **Line 582** (HIGH): Any type usage: private generateMedicationRequestContent(medication: any): string {
- **Line 597** (HIGH): Any type usage: private generateDiagnosticReportContent(report: any): string {
- **Line 663** (MEDIUM): Console statement: console.error(`Failed to index document ${document.id}:`, error);
- **Line 705** (MEDIUM): Console statement: console.error("Failed to get ingestion stats:", error);

### apps\backend\src\services\embedding.service.ts

- **Line 47** (HIGH): Any type usage: const json: any = await resp.json().catch(() => ({}));
- **Line 52** (HIGH): Any type usage: return vector.map((v: any) => Number(v));

### apps\backend\src\services\datalake.service.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 33** (MEDIUM): Console statement: console.warn("[DataLakeService] Disabled: missing AZURE_STORAGE_KEY");

### apps\backend\src\services\datalake-explorer.service.ts

- **Line 19** (HIGH): Any type usage: let manifestCache: { data: any[]; expires: number } | null = null;
- **Line 25** (HIGH): Any type usage: const out: any[] = [];

### apps\backend\src\services\azureSearch.service.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 14** (HIGH): Any type usage: [key: string]: any;
- **Line 74** (MEDIUM): Console statement: console.warn(
- **Line 82** (MEDIUM): Console statement: console.warn(
- **Line 107** (MEDIUM): Console statement: console.log("Azure Search service initialized successfully");
- **Line 109** (MEDIUM): Console statement: console.warn("Failed to initialize Azure Search service:", error);
- **Line 131** (MEDIUM): Console statement: console.log("Using fallback mode for search");
- **Line 137** (HIGH): Any type usage: const searchOptions: any = {
- **Line 211** (MEDIUM): Console statement: console.error(
- **Line 417** (MEDIUM): Console statement: console.log("Using fallback mode for document indexing");
- **Line 423** (MEDIUM): Console statement: console.log(`Document indexed successfully: ${document.id}`);
- **Line 425** (MEDIUM): Console statement: console.error("Error indexing document:", error);
- **Line 435** (MEDIUM): Console statement: console.log("Using fallback mode for document deletion");
- **Line 441** (MEDIUM): Console statement: console.log(`Document deleted successfully: ${documentId}`);
- **Line 443** (MEDIUM): Console statement: console.error("Error deleting document:", error);
- **Line 453** (MEDIUM): Console statement: console.log("Using fallback mode for document retrieval");
- **Line 461** (MEDIUM): Console statement: console.error("Error retrieving document:", error);

### apps\backend\src\services\azureOpenAI.service.ts

- **Line 66** (MEDIUM): Console statement: console.warn("Azure OpenAI configuration missing: service will run in fallback mode");
- **Line 84** (MEDIUM): Console statement: console.log("Azure OpenAI service initialized successfully");
- **Line 86** (MEDIUM): Console statement: console.warn("Failed to initialize Azure OpenAI service:", error);
- **Line 109** (MEDIUM): Console statement: console.log("Using fallback mode for appeal draft generation");
- **Line 164** (MEDIUM): Console statement: console.error("Error generating appeal draft with OpenAI, falling back to fallback mode:", error);
- **Line 226** (MEDIUM): Console statement: console.log("Using fallback mode for conversational response");
- **Line 273** (MEDIUM): Console statement: console.error("Error generating conversational response with OpenAI, falling back to fallback mode:", error);
- **Line 317** (MEDIUM): Console statement: console.log("Using fallback mode for embeddings generation");
- **Line 330** (MEDIUM): Console statement: console.error("Error generating embeddings with OpenAI, falling back to fallback mode:", error);
- **Line 339** (MEDIUM): Console statement: console.log("Generating fallback embeddings for:", text);

### apps\backend\src\services\azureCosmos.service.ts

- **Line 2** (HIGH): Any type usage: let CosmosClient: any;
- **Line 98** (HIGH): Any type usage: oldValue?: any;
- **Line 99** (HIGH): Any type usage: newValue?: any;
- **Line 131** (HIGH): Any type usage: private client: any;
- **Line 132** (HIGH): Any type usage: private database: any | null = null;
- **Line 321** (HIGH): Any type usage: if ((error as any).code === 404) {
- **Line 494** (HIGH): Any type usage: if ((error as any).code === 404) {

### apps\backend\src\scripts\populate-ai-search.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 57** (HIGH): Any type usage: [key: string]: any;
- **Line 261** (HIGH): Any type usage: containerClient: any,
- **Line 313** (HIGH): Any type usage: containerClient: any,
- **Line 394** (HIGH): Any type usage: containerClient: any,
- **Line 532** (HIGH): Any type usage: private fhirToText(fhirResource: any): string {
- **Line 540** (HIGH): Any type usage: .map((c: any) => `${c.code}: ${c.display || c.code}`)

### apps\backend\src\scripts\index-to-search.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 21** (HIGH): Any type usage: [key: string]: any;
- **Line 70** (MEDIUM): Console statement: console.log("🔍 Starting FHIR data indexing...");
- **Line 90** (MEDIUM): Console statement: console.log(`📋 Processing ${resourceType} resources...`);
- **Line 106** (MEDIUM): Console statement: console.log(`  📄 Found ${lines.length} ${resourceType} records`);
- **Line 118** (MEDIUM): Console statement: console.log(`    ✅ Indexed ${totalIndexed} total documents`);
- **Line 122** (MEDIUM): Console statement: console.warn(
- **Line 128** (MEDIUM): Console statement: console.error(`❌ Error processing ${resourceType}: ${error}`);
- **Line 132** (MEDIUM): Console statement: console.log(
- **Line 235** (MEDIUM): Console statement: console.warn(`⚠️  Failed to generate embedding: ${error}`);
- **Line 262** (HIGH): Any type usage: resource.code.coding.forEach((coding: any) => {
- **Line 268** (HIGH): Any type usage: resource.diagnosis.forEach((diag: any) => {
- **Line 293** (MEDIUM): Console statement: console.error(`❌ Error indexing batch: ${error}`);
- **Line 302** (HIGH): Any type usage: const chunks: any[] = [];
- **Line 317** (MEDIUM): Console statement: indexer.indexFHIRData().catch(console.error);

### apps\backend\src\scripts\index-from-database.ts

- **Line 2** (MEDIUM): Console statement: console.log('index-from-database script removed - implement Cosmos version if needed.');

### apps\backend\src\scripts\generate-embeddings.ts

- **Line 2** (MEDIUM): Console statement: console.log('generate-embeddings script removed - implement Cosmos version if needed.');

### apps\backend\src\scripts\generate-all-embeddings.ts

- **Line 2** (MEDIUM): Console statement: console.log('generate-all-embeddings script removed - implement Cosmos version if needed.');

### apps\backend\src\scripts\download-huggingface-dataset.ts

- **Line 69** (HIGH): Any type usage: function normalizeRecord(record: any): any {
- **Line 93** (MEDIUM): Console statement: console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
- **Line 97** (HIGH): Any type usage: async function saveRecordsBatch(records: any[], batchNumber: number): Promise<string> {
- **Line 102** (MEDIUM): Console statement: console.log(`💾 Saved ${records.length} records to ${filename}`);
- **Line 130** (MEDIUM): Console statement: console.log(`📋 Created manifest: ${manifestPath}`);
- **Line 135** (MEDIUM): Console statement: console.log("🤗 Starting Hugging Face dataset download...");
- **Line 136** (MEDIUM): Console statement: console.log(`📊 Dataset: ${DATASET_NAME}`);
- **Line 142** (MEDIUM): Console statement: console.log("🔍 Fetching dataset information...");
- **Line 145** (MEDIUM): Console statement: console.log(`📈 Dataset info:`, {
- **Line 155** (MEDIUM): Console statement: console.log(`📝 Using split: ${splitToUse}`);
- **Line 164** (MEDIUM): Console statement: console.log(`📥 Downloading batch ${batchNumber} (offset: ${offset})...`);
- **Line 169** (MEDIUM): Console statement: console.log("✅ Reached end of dataset");
- **Line 184** (MEDIUM): Console statement: console.log(`📊 Progress: ${totalRecords} records downloaded`);
- **Line 191** (MEDIUM): Console statement: console.log("🛑 Reached safety limit of 10,000 records");
- **Line 199** (MEDIUM): Console statement: console.log(`✅ Download complete!`);
- **Line 200** (MEDIUM): Console statement: console.log(`   📄 Total records: ${totalRecords.toLocaleString()}`);
- **Line 201** (MEDIUM): Console statement: console.log(`   📦 Total batches: ${batchNumber - 1}`);
- **Line 202** (MEDIUM): Console statement: console.log(`   📁 Output directory: ${OUTPUT_DIR}`);
- **Line 203** (MEDIUM): Console statement: console.log(`   🚀 Ready for Azure Data Lake upload!`);
- **Line 206** (MEDIUM): Console statement: console.error("❌ Download failed:", error);

### apps\backend\src\scripts\create-rag-index.ts

- **Line 1** (HIGH): TypeScript directive: // @ts-nocheck
- **Line 33** (HIGH): Any type usage: private fileSystemClient: any;
- **Line 80** (MEDIUM): Console statement: console.log("🚀 Starting RAG index creation from Data Lake...");
- **Line 84** (MEDIUM): Console statement: console.log("📂 Listing files from bronze/huggingface directory...");
- **Line 95** (MEDIUM): Console statement: console.warn("⚠️  No .json or .jsonl files found. Nothing to index.");
- **Line 99** (MEDIUM): Console statement: console.log(
- **Line 107** (MEDIUM): Console statement: console.log(`\n📄 Processing file: ${path}`);
- **Line 120** (MEDIUM): Console statement: console.warn(
- **Line 143** (MEDIUM): Console statement: console.warn(`  Skipping malformed JSON: ${(e as Error).message}`);
- **Line 147** (MEDIUM): Console statement: console.log(`  ✅ Parsed ${records.length} records from file.`);
- **Line 164** (MEDIUM): Console statement: console.error(
- **Line 183** (MEDIUM): Console statement: console.log(
- **Line 189** (MEDIUM): Console statement: console.error(
- **Line 198** (MEDIUM): Console statement: console.log(`\n🎉 Completed. Total documents indexed: ${total}`);
- **Line 204** (MEDIUM): Console statement: console.log(`🔎 Index '${this.indexName}' already exists.`);
- **Line 210** (MEDIUM): Console statement: console.log(`🆕 Creating index '${this.indexName}'...`);
- **Line 212** (HIGH): Any type usage: const fields: any[] = [
- **Line 242** (MEDIUM): Console statement: console.log("✅ Index created.");
- **Line 245** (HIGH): Any type usage: private async listFilesRecursive(dir: any, prefix = ""): Promise<string[]> {
- **Line 256** (MEDIUM): Console statement: console.warn(`Failed to list files: ${error}`);
- **Line 287** (HIGH): Any type usage: private extractTextFromRecord(obj: any): string | null {
- **Line 308** (HIGH): Any type usage: .map((m: any) => {
- **Line 334** (MEDIUM): Console statement: console.error("Unhandled error:", err);

### apps\backend\src\scripts\complete-ai-pipeline.ts

- **Line 61** (MEDIUM): Console statement: console.log(logEntry.trim());
- **Line 77** (HIGH): Any type usage: } catch (error: any) {
- **Line 171** (MEDIUM): Console statement: console.log('RAG Response:', JSON.stringify(response, null, 2));
- **Line 174** (MEDIUM): Console statement: console.error('RAG Error:', error);
- **Line 360** (HIGH): Any type usage: } catch (error: any) {
- **Line 375** (MEDIUM): Console statement: console.log('Pipeline completed successfully!');
- **Line 379** (MEDIUM): Console statement: console.error('Pipeline failed:', error.message);

### apps\backend\src\scripts\augment-denials.ts

- **Line 31** (MEDIUM): Console statement: console.log(`Reading payers from ${payerPath}...`);
- **Line 38** (MEDIUM): Console statement: console.log(`Starting claims transformation. Denial rate: ${DENIAL_RATE * 100}%`);
- **Line 64** (MEDIUM): Console statement: console.log(`✅ Transformation complete. Output written to ${outPath}`);

### apps\backend\src\routes\users.ts

- **Line 13** (MEDIUM): Console statement: console.error('Error fetching users:', error);
- **Line 30** (MEDIUM): Console statement: console.error('Error creating user:', error);
- **Line 48** (MEDIUM): Console statement: console.error('Error fetching user:', error);
- **Line 63** (MEDIUM): Console statement: console.error('Error updating user:', error);
- **Line 77** (MEDIUM): Console statement: console.error('Error deleting user:', error);

### apps\backend\src\routes\strategy.ts

- **Line 96** (MEDIUM): Console statement: console.error("Error building evidence bundle:", error);
- **Line 151** (MEDIUM): Console statement: console.warn(
- **Line 169** (HIGH): Any type usage: const aiMeta: any = (aiAppealDraft as any).metadata || {};
- **Line 172** (HIGH): Any type usage: draftId: (aiAppealDraft as any).draftId,
- **Line 191** (MEDIUM): Console statement: console.error("Error generating appeal draft:", error);
- **Line 210** (HIGH): Any type usage: const fired: any[] = [];
- **Line 223** (HIGH): Any type usage: } catch (e: any) {
- **Line 238** (HIGH): Any type usage: const label = (op as any).payload.label;
- **Line 245** (HIGH): Any type usage: rec.avgMs + ((op as any).payload.duration_ms - rec.avgMs) / rec.count;
- **Line 250** (HIGH): Any type usage: .filter((o) => (o as any).payload.label === label)
- **Line 251** (HIGH): Any type usage: .map((o) => (o as any).payload.duration_ms)
- **Line 264** (HIGH): Any type usage: const b = (e as any).payload.perfBucket;
- **Line 270** (HIGH): Any type usage: let citations: any = undefined;
- **Line 276** (HIGH): Any type usage: all.forEach((c: any) => {
- **Line 289** (HIGH): Any type usage: message: (err as any)?.message,
- **Line 349** (MEDIUM): Console statement: console.warn("Azure OpenAI failed for conversational query:", aiError);
- **Line 376** (MEDIUM): Console statement: console.error("Error processing conversational query:", error);
- **Line 400** (MEDIUM): Console statement: console.error("Error searching clinical evidence:", error);
- **Line 427** (MEDIUM): Console statement: console.error("Error searching denial patterns:", error);

### apps\backend\src\routes\queries.ts

- **Line 21** (MEDIUM): Console statement: console.error('Error fetching queries:', error);
- **Line 50** (MEDIUM): Console statement: console.error('Error creating query:', error);
- **Line 61** (HIGH): Any type usage: let user: any = null;
- **Line 73** (MEDIUM): Console statement: console.error('Error fetching query:', error);
- **Line 84** (HIGH): Any type usage: const updatePayload: any = { updatedAt: new Date() };
- **Line 91** (HIGH): Any type usage: let user: any = null;
- **Line 98** (MEDIUM): Console statement: console.error('Error updating query:', error);
- **Line 111** (MEDIUM): Console statement: console.error('Error deleting query:', error);

### apps\backend\src\routes\physicianQueries.ts

- **Line 9** (LOW): TODO/FIXME item: // TODO: import { requireRoles } from '../middleware/rbac';
- **Line 73** (MEDIUM): Console statement: console.error("Create physician query failed", e);
- **Line 104** (MEDIUM): Console statement: console.error("Send physician query failed", e);
- **Line 147** (MEDIUM): Console statement: console.error("Respond physician query failed", e);
- **Line 182** (MEDIUM): Console statement: console.error("Fetch audit chain failed", e);

### apps\backend\src\routes\fhir.ts

- **Line 45** (MEDIUM): Console statement: console.error("FHIR ingestion failed:", error);
- **Line 76** (MEDIUM): Console statement: console.error("Failed to get ingestion stats:", error);
- **Line 120** (MEDIUM): Console statement: console.error("Failed to schedule FHIR ingestion:", error);
- **Line 138** (LOW): TODO/FIXME item: // TODO: Implement real validation logic. For now, return structural placeholder (not mock data) without synthetic resources.
- **Line 170** (MEDIUM): Console statement: console.error("FHIR validation failed:", error);
- **Line 204** (HIGH): Any type usage: resources: items.map((r: any) => ({
- **Line 219** (MEDIUM): Console statement: console.error("Failed to get FHIR resources:", error);
- **Line 253** (HIGH): Any type usage: resources: items.map((r: any) => ({
- **Line 268** (MEDIUM): Console statement: console.error("Failed to get patient resources:", error);
- **Line 303** (MEDIUM): Console statement: console.error("FHIR health check failed:", error);
- **Line 331** (MEDIUM): Console statement: console.error("Failed to persist FHIR resource:", error);

### apps\backend\src\routes\explorer.ts

- **Line 26** (HIGH): Any type usage: next(e as any);
- **Line 42** (HIGH): Any type usage: next(e as any);
- **Line 113** (HIGH): Any type usage: next(e as any);

### apps\backend\src\routes\devRag.ts

- **Line 10** (HIGH): Any type usage: [k: string]: any;

### apps\backend\src\routes\database.ts

- **Line 36** (MEDIUM): Console statement: console.log(`Container ${container.id} ready`);
- **Line 38** (MEDIUM): Console statement: console.error(`Failed to create container ${container.id}:`, error);
- **Line 42** (MEDIUM): Console statement: console.error("Failed to initialize Cosmos DB schema:", error);
- **Line 48** (HIGH): Any type usage: async function storeDenialPattern(pattern: any) {
- **Line 54** (MEDIUM): Console statement: console.error("Failed to store denial pattern:", error);
- **Line 71** (MEDIUM): Console statement: console.error("Failed to get denial patterns:", error);
- **Line 77** (HIGH): Any type usage: async function storeAppealCase(appealCase: any) {
- **Line 83** (MEDIUM): Console statement: console.error("Failed to store appeal case:", error);
- **Line 111** (MEDIUM): Console statement: console.error("Failed to update appeal case status:", error);
- **Line 128** (MEDIUM): Console statement: console.error("Failed to get appeal cases by patient:", error);
- **Line 153** (MEDIUM): Console statement: console.error("Failed to calculate real-time KPIs:", error);
- **Line 159** (HIGH): Any type usage: async function storeKPIMetric(metric: any) {
- **Line 165** (MEDIUM): Console statement: console.error("Failed to store KPI metric:", error);
- **Line 186** (MEDIUM): Console statement: console.error("Failed to get KPI metrics:", error);
- **Line 192** (HIGH): Any type usage: async function storeEvidenceBundle(bundle: any) {
- **Line 198** (MEDIUM): Console statement: console.error("Failed to store evidence bundle:", error);
- **Line 211** (MEDIUM): Console statement: console.error("Failed to get evidence bundle:", error);
- **Line 228** (MEDIUM): Console statement: console.error("Failed to get evidence bundles by patient:", error);
- **Line 234** (HIGH): Any type usage: async function storeAttributionTracking(attribution: any) {
- **Line 240** (MEDIUM): Console statement: console.error("Failed to store attribution tracking:", error);
- **Line 262** (MEDIUM): Console statement: console.error("Failed to update attribution verification:", error);
- **Line 268** (HIGH): Any type usage: async function storeDocumentVersion(version: any) {
- **Line 274** (MEDIUM): Console statement: console.error("Failed to store document version:", error);
- **Line 291** (MEDIUM): Console statement: console.error("Failed to get document versions:", error);
- **Line 297** (HIGH): Any type usage: async function storeCollaborationSession(session: any) {
- **Line 303** (MEDIUM): Console statement: console.error("Failed to store collaboration session:", error);
- **Line 309** (HIGH): Any type usage: async function updateCollaborationSession(sessionId: string, updates: any) {
- **Line 324** (MEDIUM): Console statement: console.error("Failed to update collaboration session:", error);
- **Line 330** (HIGH): Any type usage: async function addCollaborationActivity(sessionId: string, activity: any) {
- **Line 349** (MEDIUM): Console statement: console.error("Failed to add collaboration activity:", error);
- **Line 362** (MEDIUM): Console statement: console.error("Failed to get collaboration session:", error);
- **Line 379** (MEDIUM): Console statement: console.error("Failed to get active collaboration sessions:", error);
- **Line 394** (MEDIUM): Console statement: console.error("Cosmos DB health check failed:", error);
- **Line 414** (MEDIUM): Console statement: console.error("Overall health check failed:", error);
- **Line 434** (MEDIUM): Console statement: console.error("Connection status check failed:", error);
- **Line 450** (MEDIUM): Console statement: console.error("Failed to initialize all databases:", error);

### apps\backend\src\routes\citationMetrics.ts

- **Line 74** (MEDIUM): Console statement: console.error("Error in citation health check:", error);
- **Line 210** (MEDIUM): Console statement: console.error("Error in citation analytics:", error);
- **Line 269** (MEDIUM): Console statement: console.error("Error in citations list:", error);
- **Line 310** (MEDIUM): Console statement: console.error("Error in citation detail:", error);
- **Line 357** (MEDIUM): Console statement: console.error("Error in coverage analysis:", error);
- **Line 381** (HIGH): Any type usage: .map((s: any) => s.citation)
- **Line 397** (MEDIUM): Console statement: console.error("Error in evidence quality analysis:", error);
- **Line 486** (MEDIUM): Console statement: console.error("Error in citation statistics:", error);
- **Line 495** (HIGH): Any type usage: function generateCoverageRecommendations(coverage: any, sourceDetails: any[]) {
- **Line 521** (HIGH): Any type usage: evidenceBundle: any,
- **Line 563** (HIGH): Any type usage: function generateQualityRecommendations(qualityMetrics: any, coverage: any) {

### apps\backend\src\routes\citationCoverage.ts

- **Line 19** (HIGH): Any type usage: let evidenceSample: any = null;
- **Line 22** (HIGH): Any type usage: if (evidenceGraph && Array.isArray((evidenceGraph as any).nodes)) {
- **Line 23** (HIGH): Any type usage: for (const n of (evidenceGraph as any).nodes) {
- **Line 24** (HIGH): Any type usage: if (n && (n as any).citation) sources.push((n as any).citation);

### apps\backend\src\routes\cdi.ts

- **Line 79** (HIGH): Any type usage: processingTime: Date.now() - (req as any).startTime
- **Line 145** (HIGH): Any type usage: processingTime: Date.now() - (req as any).startTime
- **Line 220** (HIGH): Any type usage: processingTime: Date.now() - (req as any).startTime,
- **Line 260** (LOW): TODO/FIXME item: // TODO: Implement retrieval from database
- **Line 396** (HIGH): Any type usage: (req as any).startTime = Date.now();

### apps\backend\src\routes\cases.ts

- **Line 36** (LOW): TODO/FIXME item: // TODO: implement proper indexed search in Cosmos
- **Line 57** (HIGH): Any type usage: } catch (error: any) {
- **Line 58** (MEDIUM): Console statement: console.error('Error fetching cases:', error);
- **Line 91** (HIGH): Any type usage: } catch (error: any) {
- **Line 92** (MEDIUM): Console statement: console.error('Case conversation error:', error);
- **Line 110** (MEDIUM): Console statement: console.error('Error fetching case:', error);
- **Line 170** (MEDIUM): Console statement: console.error('Error creating case:', error);
- **Line 188** (MEDIUM): Console statement: console.error('Error updating case:', error);
- **Line 202** (MEDIUM): Console statement: console.error('Error deleting case:', error);
- **Line 228** (HIGH): Any type usage: } catch (error: any) {
- **Line 229** (MEDIUM): Console statement: console.error('Error running pre-bill enrichment:', error);
- **Line 240** (HIGH): Any type usage: const where: any = {};
- **Line 271** (HIGH): Any type usage: } catch (e: any) {
- **Line 279** (HIGH): Any type usage: } catch (error: any) {
- **Line 280** (MEDIUM): Console statement: console.error('Error running bulk pre-bill enrichment:', error);

### apps\backend\src\routes\analytics.ts

- **Line 41** (MEDIUM): Console statement: console.error("Failed to get revenue analytics:", error);
- **Line 79** (MEDIUM): Console statement: console.error("Failed to get denial analytics:", error);
- **Line 117** (MEDIUM): Console statement: console.error("Failed to get appeal analytics:", error);
- **Line 152** (MEDIUM): Console statement: console.error("Failed to get coding analytics:", error);
- **Line 195** (MEDIUM): Console statement: console.error("Failed to get performance analytics:", error);
- **Line 244** (MEDIUM): Console statement: console.error("Failed to get predictive analytics:", error);
- **Line 285** (MEDIUM): Console statement: console.error("Failed to get custom analytics:", error);
- **Line 312** (MEDIUM): Console statement: console.error("Failed to export analytics:", error);
- **Line 332** (MEDIUM): Console statement: console.error("Failed to download file:", error);

### apps\backend\src\repositories\user.repository.ts

- **Line 21** (HIGH): Any type usage: private container: any;

### apps\backend\src\repositories\query.repository.ts

- **Line 9** (HIGH): Any type usage: sources?: any[] | null;
- **Line 25** (HIGH): Any type usage: private container: any; // partition by id for now

### apps\backend\src\repositories\physicianQueryAudit.repository.ts

- **Line 32** (HIGH): Any type usage: private container: any; // partitionKey on physicianQueryId for grouping

### apps\backend\src\repositories\physicianQuery.repository.ts

- **Line 60** (HIGH): Any type usage: private container: any;

### apps\backend\src\repositories\case.repository.ts

- **Line 33** (HIGH): Any type usage: create: (item: any) => Promise<any>;
- **Line 34** (HIGH): Any type usage: query: (query: any) => { fetchAll: () => Promise<{ resources: any[] }> };
- **Line 37** (HIGH): Any type usage: read: () => Promise<{ resource: any }>;
- **Line 38** (HIGH): Any type usage: replace: (item: any) => Promise<any>;
- **Line 49** (HIGH): Any type usage: const db = (svc as any).database;
- **Line 50** (HIGH): Any type usage: if (db && !(svc as any).containers[CONTAINER_ID]) {
- **Line 55** (HIGH): Any type usage: (svc as any).containers[CONTAINER_ID] = container;
- **Line 57** (HIGH): Any type usage: return (svc as any).containers[CONTAINER_ID];
- **Line 104** (HIGH): Any type usage: if ((e as any).code === 404) return null;
- **Line 163** (HIGH): Any type usage: if ((e as any).code === 404) return false;

### apps\frontend\src\components\kpi\KPIMonitoringCard.tsx

- **Line 22** (HIGH): Any type usage: onRuleTrigger?: (event: any) => void;
- **Line 72** (MEDIUM): Console statement: console.error('Rule evaluation failed:', error);

### apps\frontend\src\components\shared\Heading.tsx

- **Line 16** (HIGH): Any type usage: return <Tag className={cn(map[level], className)} {...(props as any)} />;

### apps\frontend\src\components\shared\ErrorBoundary.tsx

- **Line 41** (MEDIUM): Console statement: console.error('ErrorBoundary caught an error:', error, errorInfo);
- **Line 52** (MEDIUM): Console statement: console.error('Production error:', error.message);

### apps\frontend\src\components\shared\EnhancedCDIAnalysis.tsx

- **Line 136** (HIGH): Any type usage: } catch (err: any) {
- **Line 173** (HIGH): Any type usage: } catch (err: any) {
- **Line 325** (HIGH): Any type usage: onClick={() => setActiveTab(id as any)}

### apps\frontend\src\components\shared\DataTable.tsx

- **Line 18** (HIGH): Any type usage: render?: (value: any, row: any) => React.ReactNode;
- **Line 26** (HIGH): Any type usage: data: any[];
- **Line 29** (HIGH): Any type usage: onRowClick?: (row: any) => void;

### apps\frontend\src\components\shared\CitationAnalyticsCard.tsx

- **Line 51** (MEDIUM): Console statement: console.error('Error fetching citation data:', err);

### apps\frontend\src\components\database\DatabaseHealthMonitor.tsx

- **Line 41** (MEDIUM): Console statement: console.error('Failed to initialize databases:', error);

## Recommended Actions

### Console Statements (313 found)
- Replace with structured logging using Winston
- Use appropriate log levels (info, warn, error, debug)
- Add context metadata for better debugging

### Type Safety Issues (205 found)
- Replace 'any' types with proper interfaces
- Remove @ts-ignore and @ts-nocheck directives
- Add proper type definitions

### TODO Items (7 found)
- Review and prioritize implementation
- Remove obsolete TODO items
- Create proper issue tracking

