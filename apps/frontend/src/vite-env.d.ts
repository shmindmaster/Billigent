/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly PROD: boolean;
  // Add any custom env vars here, e.g.:
  // readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
