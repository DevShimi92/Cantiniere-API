declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string;
        SECRET_KEY: string;
        SECRET_KEY_REFRESH: string;
      }
    }
  }
  
  export {};