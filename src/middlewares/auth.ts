import { Request, Response } from "express";
import { log } from "../config/log_config";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
    
    public async checkJWT (req:Request, res:Response, adminRight:boolean, next:Function):Promise<void> {

        log.info("Check token...");

        let token = req.headers.authorization;

        if (!!token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        if (token)
        {
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded:any) => {
                if (err) {
                    log.info("Token not valid");
                    res.status(401).end();
                } else {
                    if(typeof decoded !== 'undefined') {
                        
                        if(decoded.cooker)
                            {
                                res.locals.cooker = decoded.cooker; 
                            }

                        log.info("Token of "+decoded.last_name+" : OK ");
                       
                        }
                    else
                        {
                            log.warn("Token OK but data not found");
                            log.warn(decoded);
                        }

                    if(!adminRight)
                        {
                            next();
                        }
                    else if(decoded.cooker)
                        {
                            next();
                        }
                    else
                        {
                            log.warn("Access forbidden");
                            res.status(403).end(); 
                        }
                        
                    
                }
            });
        }
        else 
            {
                log.warn("Token not found");
                res.status(401).end();
            }
    }
}