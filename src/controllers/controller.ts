import { Request, Response } from "express";
import { log } from "../config/log_config";

export class Controller {
  public index(req: Request, res: Response) {
    log.info("Ping on api");
    res.status(200).json({
       message: "Cantiniere-API"
    });
  }
}