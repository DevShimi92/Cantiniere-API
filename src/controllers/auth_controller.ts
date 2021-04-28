import { Request, Response } from "express";
import { log } from "../config/log_config";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

export class AuthController {
  public async login(req: Request, res: Response) : Promise<void> {
    log.info("Connection attempt to api");

    if (req.body.email == null || req.body.password == null)
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Connection to api : Fail - Missing Fields");
      }
    else
      {
        
        await User.findOne<User>({
          attributes : ['id','last_name','first_name','email','money','password','cooker'],
          raw: true,
          where: {
            email: req.body.email
          }
        }).then(function(data) { 

          if(data == null)
            {
              log.error("Connection to api : Fail - Account not found");
              res.status(401).end();
            }
          else
            {
              if( req.body.password == data.password)
              {

                let dataUser = { 
                  id : data.id, 
                  last_name : data.last_name,
                  first_name: data.first_name,
                  email: data.email,
                  money: data.money,
                  cooker: data.cooker
                };
                
                let token = jwt.sign(dataUser,process.env.SECRET_KEY);
                
                res.status(200).json({
                    token: token
                }).end();

                log.info("API connection successful for : " + data.last_name);
              }
              else
                {
                  log.error("Connection to api : Fail - Failed identification");
                  res.status(401).end();
                }
            }
    
        
        });

      }

  }
  public loginTest(req: Request, res: Response) : void {
    console.log("HELL YUEAH");
    res.status(200).json({
      hell: 'yeah'
   }).end();
  }

}