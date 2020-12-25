import { Request, Response } from "express";
import { log } from "../config/log_config";
import { User } from "../models/user";


export class Controller {
  public index(req: Request, res: Response) : void {
    log.info("Ping on api");
    res.status(200).json({
       message: "Cantiniere-API"
    });
  }

  public user(req: Request, res: Response) : void {
    log.info("test");
    User.findAll<User>({})
      .then((links: Array<User>) => res.json(links))
      .catch((err: Error) => res.status(500).json(err));
  }

}