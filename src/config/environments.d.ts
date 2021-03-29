declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string;
        SECRET_KEY: string;
      }
    }
  }
  
  export {};