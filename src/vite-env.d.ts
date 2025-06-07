interface ImportMetaEnv {
  // Built-in Vite env variables
  readonly VITE_API_URL: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
