import { Request, Response } from "express";
import { log } from "../config/log_config";

export class AuthController {
  // Fake authentication  for test with the website for the moment. But in the end, the true method will be here.
  public login(req: Request, res: Response) : void {
    log.info("Connection attempt to api");
    
    if (req.body.email == null ||req.body.password == null)
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Connection to api : Fail - Missing Fields");
      }
    else
      {
        if( req.body.email == 'test@test.com' && req.body.password == 'test')
          {
            res.status(200).json({token: 'FAKETOKEN'}).end();
          }
        else
          {
            res.status(401).end();
          }

      }

  }

}