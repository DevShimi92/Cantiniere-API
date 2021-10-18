declare global {
    namespace NodeJS {
      interface ProcessEnv {
        SSL_OPTION: string;
        WHITE_LIST_CORS_ORIGIN: string;
        COOKER_DEFAUT_EMAIL: string;
        COOKER_DEFAUT_PASSWORD: string;
        DATABASE_URL: string;
        SITE_URL: string;
        SECRET_KEY: string;
        SECRET_KEY_REFRESH: string;
        FOLDER_IMAGE_PATH: string;
        CLOUDINARY_URL: string;
        API_TEST: string;

        SECRET_KEY_REST: string;
        HOST_SMTP_URL: string;
        SMTP_PORT:number;
        EMAIL_SUPPORT: string;
        PASSWORD_SUPPORT: string;

        NODE_MAIL_TEST_MODE: string;
        SECRET_KEY_REST_TEST: string;
        HOST_SMTP_URL_TEST: string;
        SMTP_PORT_TEST:number;
        EMAIL_SUPPORT_TEST: string;
        PASSWORD_SUPPORT_TEST: string;

      }
    }
  }
  
  export {};