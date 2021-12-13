import { Request, Response } from "express";
import { log } from "../config/log_config";

export class DefaultController {
/**
 * @api {all} / Ping of api
 * @apiName All
 * @apiGroup Ping
 * 
 * @apiSuccess {String} message Ping return message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Shindra-Online-API"
 *     }
 */
  public index(req: Request, res: Response) : void {
    log.info("Ping on api");
    res.status(200).json({
       message: "Cantiniere-API2"
    });
  }

}