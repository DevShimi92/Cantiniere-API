import { Request, Response } from "express";
import { log } from "../config/log_config";

export class DefaultController {

  public index(req: Request, res: Response) : void {
    log.info("Ping on api");
    res.status(200).json({
       message: "Cantiniere-API"
    });
  }

}