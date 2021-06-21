import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto  from "crypto";

import { log } from "../config/log_config";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh_token";
import { RestToken } from "../models/rest_token";
import { MailController } from './mail_controller';

function randomValueHex (length:number) {
  return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0,length).toUpperCase();   // return required number of characters
}


export class UserController {

  public async createUser(req: Request, res: Response) : Promise<void> {

    log.info("Create User");

    if (req.body.last_name == null || req.body.first_name == null || req.body.email == null || req.body.password == null )
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
            }).then(function(data) { 
              return data;
            });
          
        if (emailFound.length > 0)
            {
              res.status(409);
              res.end();
              log.error("Create User : Fail - Account already exist");      
            }
        else
            {
              let newdata = await User.create<User>({ 
                  last_name: req.body.last_name,
                  first_name: req.body.first_name,
                  password: req.body.password,
                  email: req.body.email, })
                .then((result) => {
                
                    return result.get({ plain: true });
                
                }).catch((err: Error) => {
                
                  res.status(500).end();
                  log.error("Create User : Fail - ERROR");
                  log.error(err);
                
                });
              
              let dataSendInToken = {
                    id: newdata.id,
                    last_name: newdata.last_name,
                    first_name: newdata.first_name,
                    email: newdata.email,
                    money: newdata.money,
                    cooker: false,
              }

              let token = jwt.sign(dataSendInToken,process.env.SECRET_KEY,{ expiresIn: 60 * 15 });

              let refresh_token = jwt.sign({key_random : randomValueHex(40)},process.env.SECRET_KEY_REFRESH);

              await RefreshToken.create<RefreshToken>({id_client: newdata.id, tokenRefresh: refresh_token }).then(async () => {
               
                await MailController.mailNewAccount(req.body.email);
                // res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refresh_token, { httpOnly: true }))
                 res.status(201).json({
                   token: token,
                   refresh_token: refresh_token
                   }).end();

                   log.info("Create User : OK");

                   

                 }).catch((err: Error) => {
                   res.status(500).end();
                   log.error("Create User : Fail - ERROR");
                   log.error(err);
                 });

            }

      }
    
  }
  
  public async getAllUser(req: Request,res: Response) : Promise<void> {
    log.info("Get all User");
    if(res.locals.cooker)
      {
          await User.findAll<User>({
            attributes : ['id','first_name','last_name','money'],
            where: {
              cooker: false
            },
            order:  [
              ['money', 'DESC']
            ],
            raw: true,
          }).then(function(data) { 
      
            if(data.length == 0)
              {
                res.status(204).end();
              }
            else
              {
                res.status(200).json(data).end();
              }
      
            log.info("Get all User : OK");
          
          });
      }
    else
      {
        log.warn("Get all User : ERROR - User not admin");
        res.status(403).end();
      }
    

  }

  public async updateUser(req: Request, res: Response) : Promise<void> {
    log.info("Update User");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update User : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Update User : Fail - The value is not number"); 
      }
    else
    {
      const idSearch = await User.findAll<User>({
        attributes : ['id'],
        raw: true,
        where: {
          id: req.body.id
        }
          }).then(function(data) { 
        return data;
      });

      if (idSearch.length == 0)
        {
          res.status(404).json({ error : 'Account not exist' });
          res.end();
          log.error("Update User : Fail - Account not exist");      
        }
      else
        {
          let OK = 0;
          let Error = 0;

          if(req.body.first_name != null)
          {
            await User.update({ first_name: req.body.first_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field first_name of user : ' + err);
                });
            }

          if(req.body.last_name != null)
          {
            await User.update({ last_name: req.body.last_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field last_name of user : ' + err);
                });
          }

          if(req.body.email != null)
          {
            await User.update({ email: req.body.email }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field email of user : ' + err);
                });
          }

          if((req.body.money != null) && (!isNaN(req.body.money)) && (res.locals.cooker))
          {
            await User.update({ money: req.body.money }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field money of user : ' + err);
                });
          }

          if(req.body.password != null)
          {
            await User.update({ password: req.body.password }, {
              where: {
                id: req.body.id
              }
            }).then(() => OK++)
            .catch((err: Error,) => {
              Error++;
              log.error('Error with field password of user : ' + err);
                });
          }

          if(Error == 0)
            {
              res.status(204).end();
              log.info("Update User : OK");
            }
          else
            {
              res.status(409).end();
              log.warn("Update User : OK with error - "+OK+' update done only');
            }

        }

    }

  }

  public async deleteUser(req: Request,res: Response) : Promise<void> {
    log.info("Delete User");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete User : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete User : Fail - The value is not number"); 
      }
    else if(res.locals.cooker)
      {
        await User.destroy<User>({
          where: {
            id: req.body.id
          }
        }).then(function(dataUser) {  // dataUser beacause sonarcloud logic
          if(dataUser == 0)
            {
              res.status(404).end();
              log.info("Delete User : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete User : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete User : Fail - ERROR");
          log.error(err);
        });
      }
    else
      {
        res.status(403).end();
        log.error("Delete User : Fail - User is not Admin");
      }
  }

  public async restPassword(req: Request,res: Response) : Promise<void> {
    log.info("Rest Password");

    if (req.body.password == null )
    {
          res.status(400).json({ error : 'Missing Fields' });
          res.end();
          log.error(" Missing Password");      
    }
    else
    {
      
      let tokenRestPassword = req.headers.authorization;

      if (!!tokenRestPassword && tokenRestPassword.startsWith('Bearer ')) {
          tokenRestPassword = tokenRestPassword.slice(7, tokenRestPassword.length);
        }
      
      if(tokenRestPassword)
        {
          let SECRET_KEY : string;

          if(process.env.NODE_MAIL_TEST_MODE)
                SECRET_KEY=process.env.SECRET_KEY_REST_TEST;
              else
                SECRET_KEY=process.env.SECRET_KEY_REST;
                
          jwt.verify(tokenRestPassword, SECRET_KEY, async (err) => {
            if (err) {
              log.warn("Token not valid or expired");
              res.status(401).end();
              } 
            else 
              {

                await RestToken.findOne<RestToken>({
                  attributes : ['id_client','token_Rest'],
                  raw: true,
                  where: {
                    token_Rest: tokenRestPassword
                  }}).then(async function(data) { 
                  if(data != null)
                    {
                      
                      await User.update({ password: req.body.password }, {
                        where: {
                          id: data.id_client
                        }
                      }).then(async () => {

                        res.status(200).end();
                        log.info('Rest Password success for account n° '+data.id_client);
                        await RestToken.destroy({
                          where: {
                            token_Rest: tokenRestPassword
                            }
                        }).then(() => {
                          log.info('Rest Token delete');
                        });

                      })
                      .catch((errUpdate: Error) => {
                        res.status(401).end();
                        log.error('Error with field password  : ' + errUpdate);
                          });
                    }
                  else
                    {
                      log.warn("Token not found in BDD");
                      res.status(401).end();
                    }

                });

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

}