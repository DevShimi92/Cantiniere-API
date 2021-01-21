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

  public async createUser(req: Request, res: Response) : Promise<void> {
    log.info("Create User");

    if (req.body.last_name == null || req.body.first_name == null || req.body.password == null || req.body.email == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create User : Fail - Missing Fields");      
      }
    else
      {
       
        const emailFound = await User.findAll<User>({
              attributes : ['email'],
              raw: true,
              where: {
                email: req.body.email
              }
            }).then(function(data) { return data ;} );
          
          
        if (emailFound.length > 0)
            {
              res.status(400).json({ error : 'Account already exist' });
              res.end();
              log.error("Create User : Fail - Account already exist");      
            }
        else
          {
            User.create<User>({ last_name: req.body.last_name,
                first_name: req.body.first_name,
                password: req.body.password,
                email: req.body.email, })
              .then(() => res.status(200).json())
              .catch((err: Error) => res.status(400).json(err));

              log.info("Create User : OK");
          }

      }
    
  }
  
}