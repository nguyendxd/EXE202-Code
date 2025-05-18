import "express";
import * as multer from "multer";

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File;
            files?: Multer.File[];
        }
    }
}

interface UserIdParams {
    id: string;
}

declare module "express-serve-static-core" {
    interface Request {
        params: UserIdParams;
    }
}
