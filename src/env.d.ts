interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_BASE_URL_HW: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}