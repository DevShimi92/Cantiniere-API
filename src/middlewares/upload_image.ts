import { Request, Response } from "express";
import { log } from "../config/log_config";
import fs from "fs";
import Multer from "multer";

export class UploadImageMiddleware { 

    public async uploadImage (req:Request, res:Response, next:Function):Promise<void> {
        log.info("Middleware UploadImage");
        const storage = Multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, process.env.FOLDER_IMAGE_PATH) 
            },
            filename: function (req, file, cb) {

                fs.stat(process.env.FOLDER_IMAGE_PATH+file.originalname, function(err) { 
                    if (err == null) { 
                        log.warn("Image already exists in storage! Added Date in sec at early of file name !");
                        const NewFileName = Date.now() + '-' + file.originalname ;
                        log.warn("File name used : " + NewFileName);
                        res.locals.path = process.env.FOLDER_IMAGE_PATH+NewFileName;
                        res.locals.fileName = NewFileName;
                        cb(null,NewFileName);
                    } else {
                        res.locals.path = process.env.FOLDER_IMAGE_PATH+file.originalname;
                        res.locals.fileName = file.originalname;
                        cb(null, file.originalname);
                    }
                }); 

            }
            })
        
        const upload = Multer({ 
                storage: storage,
                fileFilter: (req, file, cb) => {

                    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                        log.info("Image with an authorized format found ");
                        cb(null, true);
                    } else {
                        log.error("File with not authorized format found");
                        cb(null, false);
                        return cb(new Error('Allowed only .png, .jpg and .jpeg'));
                    }

                },
                preservePath : true
            });

        const uploadSingle = upload.array('img', 1);

                uploadSingle(req, res, function (err:any) {

                    if (err instanceof Multer.MulterError) {
                        
                        log.error("Error with Multer ( ERROR CODE : "+err.code+" ) : "+err.message);
                    
                        if (err.field) {
                            log.error("Field name : "+err.field);
                        }
                    
                        log.debug(err);
                    
                    } else if (err) {
                    log.error(err);
                    }
                    
                    next();
                
                });

    }
}