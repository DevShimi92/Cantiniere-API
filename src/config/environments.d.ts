declare global {
    namespace NodeJS {
      interface ProcessEnv {
        API_TEST: string;
        DATABASE_URL: string;
        CLIENT_URL: string;
        SECRET_KEY: string;
        SECRET_KEY_REFRESH: string;
        SECRET_KEY_REST: string;
        HOST_SMTP_URL: string;
        SMTP_PORT:number;
        EMAIL_SUPPORT: string;
        PASSWORD_SUPPORT: string;
        NODE_MAIL_TEST_MODE: boolean;
        SECRET_KEY_REST_TEST: string;
        HOST_SMTP_URL_TEST: string;
        SMTP_PORT_TEST:number;
        EMAIL_SUPPORT_TEST: string;
        PASSWORD_SUPPORT_TEST: string;
      }
    }
  }
  
  export {};