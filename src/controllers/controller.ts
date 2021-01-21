import { Request, Response } from "express";
import { log } from "../config/log_config";
import { User } from "../models/user";
import { TypeArticle } from "../models/type_article";

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
            }).then(function(data) { 
              return data;
            });
          
        if (emailFound.length > 0)
            {
              res.status(409).json({ error : 'Account already exist' });
              res.end();
              log.error("Create User : Fail - Account already exist");      
            }
        else
            {
              await User.create<User>({ last_name: req.body.last_name,
                  first_name: req.body.first_name,
                  password: req.body.password,
                  email: req.body.email, })
                .then(() => res.status(200).json().end())
                .catch((err: Error) => res.status(400).json(err));

                log.info("Create User : OK");
            }

      }
    
  }
  
  public async updateUser(req: Request, res: Response) : Promise<void> {
    log.info("Update User");

    if ( req.body.id == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update User : Fail - Missing Fields");      
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
          res.status(400).json({ error : 'Account not exist' });
          res.end();
          log.error("Update User : Fail - Account not exist");      
        }
      else
        {
          let countOK = 0;
          let countError = 0;

          if(req.body.first_name != null)
          {
            await User.update({ first_name: req.body.first_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => countOK++)
            .catch((err: Error,) => {
              countError++;
              log.error('Error with field first_name of user : ' + err);
                });
            }

          if(req.body.last_name != null)
          {
            await User.update({ last_name: req.body.last_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => countOK++)
            .catch((err: Error,) => {
              countError++;
              log.error('Error with field last_name of user : ' + err);
                });
          }

          if(req.body.email != null)
          {
            await User.update({ email: req.body.email }, {
              where: {
                id: req.body.id
              }
            }).then(() => countOK++)
            .catch((err: Error,) => {
              countError++;
              log.error('Error with field email of user : ' + err);
                });
          }

          if(req.body.password != null)
          {
            await User.update({ password: req.body.password }, {
              where: {
                id: req.body.id
              }
            }).then(() => countOK++)
            .catch((err: Error,) => {
              countError++;
              log.error('Error with field password of user : ' + err);
                });
          }

          if(countError == 0)
            {
              res.status(200).json({ msg : countOK + ' update done' });
              res.end();
              log.info("Update User : OK");
            }
          else
            {
              res.status(500).json({ msg : countOK + ' update done only' });
              res.end();
              log.warn("Update User : OK with error");
            }

         
         
        }

    }

  }

  public async createTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Type of Article");

    if (req.body.name == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create Type of Article : Fail - Missing Fields");      
      }
    else
      {
        const articleFound = await TypeArticle.findAll<TypeArticle>({
              attributes : ['name'],
              raw: true,
              where: {
                name: req.body.name
              }
            }).then(function(data) { 
              return data;
            });
          
        if (articleFound.length > 0)
            {
              res.status(409).json({ error : 'Article already exist' });
              res.end();
              log.error("Create Type of Article : Fail - Article already exist");      
            }
        else
            {
              await TypeArticle.create<TypeArticle>({ name: req.body.name })
                .then(() => res.status(200).json().end())
                .catch((err: Error) => res.status(400).json(err));

                log.info("Create Type of Article : OK");

            }

      }
    
  }

  public async updateTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Type of Article");

    if ( req.body.code_type == null || req.body.name == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Type of Article : Fail - Missing Fields");      
      }
    else
    {
      const idSearch = await TypeArticle.findAll<TypeArticle>({
        attributes : ['code_type'],
        raw: true,
        where: {
          code_type: req.body.code_type
        }
          }).then(function(data) { 
        return data;
      });

      if (idSearch.length == 0)
        {
          res.status(400).json({ error : 'Type of Article not exist' });
          res.end();
          log.error("Update Type of Article : Fail - Type of Article not exist");      
        }
      else
        {
         
            await TypeArticle.update({ name: req.body.name }, {
              where: {
                code_type: req.body.code_type
              }
            }).then(() => {
                  res.status(200);
                  res.end();
                  log.info("Update Type of Article : OK");
                })
            .catch((err: Error,) => {
                res.status(500).json({ msg : "can't update type of article" });
                res.end();
                log.error('Error with field name of type_Article : ' + err);
                });
          


          

         
         
        }

    }

  }
}