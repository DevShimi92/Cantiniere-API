declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DATABASE_URL: string;
        CLIENT_URL: string;
        SECRET_KEY: string;
        SECRET_KEY_REFRESH: string;
        SECRET_KEY_REST: string;
        HOST_SMTP_URL: string;
        SMTP_PORT:number;
        EMAIL_SUPPORT: string;
        PASSWORD_SUPPORT: string;
      }
    }
  }
  
  export {};