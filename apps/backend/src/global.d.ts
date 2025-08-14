// Ambient declarations to allow building in environments without Azure SDKs installed.
// These are intentionally loose; real implementations should install proper @azure/* packages.

declare module '@azure/cosmos' {
  export class CosmosClient { constructor(config: any); database(id: string): any; }
  export type Database = any; export type Container = any; export type DatabaseResponse = any; export type ContainerResponse = any;
}

declare module 'mssql' { export const Connection: any; export const Request: any; export const ConnectionPool: any; export const config: any; }

declare module '@azure/storage-file-datalake' {
  export class DataLakeServiceClient { static fromConnectionString(cs: string): DataLakeServiceClient; getFileSystemClient(name: string): any; }
  export type FileSystemItem = any;
}

declare module '@azure/search-documents' {
  export class SearchClient<T = any> { constructor(endpoint: string, index: string, credential: any); search(query: string, opts?: any): AsyncIterable<any>; uploadDocuments(docs: any[]): Promise<any>; }
  export class AzureKeyCredential { constructor(key: string); }
}
