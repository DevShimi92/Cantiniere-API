import { Request, Response } from "express";
import { log } from "../config/log_config";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
    
    public async checkJWT (req:Request, res:Response, next:Function):Promise<void> {

        log.info("Check token...");

        let token = req.headers.authorization;

        if (!!token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (token)
        {
            jwt.verify(token, process.env.SECRET_KEY, (err) => {
                if (err) {
                    log.info("Token not valid");
                    res.status(401).end();
                } else {
                    log.info("Token OK");
                    next();
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