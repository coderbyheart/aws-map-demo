interface ImportMeta {
  readonly env: ImportMetaEnv;
  env: {
    PUBLIC_BUILD_TIME: string;
    // Map settings
    PUBLIC_MAP_NAME: string;
    PUBLIC_MAP_API_KEY: string;
    PUBLIC_PLACES_INDEX_NAME: string;
    PUBLIC_AWS_REGION: string;
  };
}
