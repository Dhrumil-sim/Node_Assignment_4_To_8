import { FileArray, File } from 'multer';
// declare global {
//     namespace NodeJS {
//         interface ProcessEnv {
//             ACCESS_TOKEN_EXPIRY: string;
//             ACCESS_TOKEN_SECRET: String;
//             REFRESH_TOKEN_SECRET: String;
//             REFRESH_TOKEN_EXPIRY: String;
//         }
//     }
// }
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        PORT: string;
        DATABASE_URL: string;
        ACCESS_TOKEN_EXPIRY: string;
        ACCESS_TOKEN_SECRET: String;
        REFRESH_TOKEN_SECRET: String;
        REFRESH_TOKEN_EXPIRY: String;
      }
    }
  }
