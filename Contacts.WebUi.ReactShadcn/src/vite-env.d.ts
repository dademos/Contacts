/** biome-ignore-all lint/correctness/noUnusedVariables: vite */

interface ViteTypeOptions {
  strictImportMetaEnv: unknown; // Disallow undefined env vars
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
