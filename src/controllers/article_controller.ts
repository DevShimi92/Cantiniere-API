import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";

export class ArticleController {

  public async createArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Article");

    if (req.body.name == null || req.body.price == null || req.body.code_type_src == null)
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create Type of Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.code_type_src) || isNaN(req.body.price))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Create Type of Article : Fail - The value is not number"); 
      }
    else
      {
              await Article.create<Article>({ name: req.body.name, price : req.body.price, code_type_src: req.body.code_type_src})
                .then(() => {
                  res.status(201).end();
                  log.info("Create Article : OK");
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Article : Fail - ERROR");
                  log.error(err);
                });

                
      }
    
  }
  
  public async getAllArticle(req: Request,res: Response) : Promise<void> {
    log.info("Get all article");

    await Article.findAll<Article>({
      attributes : ['id','name','code_type_src','price','picture','description'],
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

      log.info("Get all article : OK");
    
    });

  }

  public async updateArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Article");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Update Article  : Fail - The value is not number"); 
      }
    else
    {
      const idSearch = await Article.findAll<Article>({
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
          res.status(404).json();
          res.end();
          log.error("Update Article : Fail - Article not exist");      
        }
      else
      {
        let OK = 0;
        let Error = 0;

        if(req.body.name != null)
        {
          await Article.update({ name: req.body.name }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Error++;
            log.error('Error with field name of Article : ' + err);
              });
          }

        if(req.body.code_type_src != null)
        {
          await Article.update({ code_type_src: req.body.code_type_src }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Error++;
            log.error('Error with field code_type_src of Article : ' + err);
              });
        }

        if(req.body.price != null)
        {
          await Article.update({ price: req.body.price }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Error++;
            log.error('Error with field price of Article : ' + err);
              });
        }

        if(req.body.picture != null)
        {
          await Article.update({ picture: req.body.picture }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Error++;
            log.error('Error with field picture of Article : ' + err);
              });
        }

        if(req.body.description != null)
        {
          await Article.update({ description: req.body.description }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Error++;
            log.error('Error with field description of Article : ' + err);
              });
        }

        if(Error == 0)
          {
            res.status(204);
            res.end();
            log.info("Update Article : OK");
          }
        else
          {
            res.status(409);
            res.end();
            log.warn("Update Article : OK with error - "+OK+' update done only');
          }

      }

    }

  }

  public async deleteArticle(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete Article : Fail - The value is not number"); 
      }
    else
      {
        await Article.destroy<Article>({
          where: {
            id: req.body.id
          }
        }).then(function(dataArticle) { // dataArticle beacause sonarcloud logic
          if(dataArticle == 0)
            {
              res.status(404).end();
              log.info("Delete Article : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Article : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete Article : Fail - ERROR");
          log.error(err);
        });
      }
  }

}