import { Request, Response } from "express";

export class Controller {
  public index(req: Request, res: Response) {
    res.json({
       message: "Cantiniere-API"
    });
  }
}