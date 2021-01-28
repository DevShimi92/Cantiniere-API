import { Request, Response } from "express";
import { log } from "../config/log_config";
import { TypeArticle } from "../models/type_article";

export class TypeArticleController {

  public async createTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Type of Article");

    if (req.body.name == null ) 
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
              res.status(409);
              res.end();
              log.error("Create Type of Article : Fail - Article already exist");      
            }
        else
            {
              await TypeArticle.create<TypeArticle>({ name: req.body.name })
                .then(() => {
                  res.status(204).end();
                  log.info("Create Type of Article : OK");
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Type of Article : Fail - ERROR");
                  log.error(err);
                });

                

            }

      }
    
  }

  public async getAllTypeArticle(req: Request,res: Response) : Promise<void> {
    log.info("Get all Type of Article");

    await TypeArticle.findAll<TypeArticle>({
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

      log.info("Get all Type of Article : OK");
    
    });

  }

  public async updateTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Type of Article");

    if ( req.body.code_type == null || req.body.name == null )
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
          res.status(404).json();
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
                  res.status(204);
                  res.end();
                  log.info("Update Type of Article : OK");
                })
            .catch((err: Error,) => {
                res.status(500);
                res.end();
                log.error('Update Type of Article : Fail - ERROR');
                log.error(err);
                });
        
        }

    }

  }

  public async deleteTypeArticle(req: Request,res: Response) : Promise<void> {
    log.info("Delete Type of Article");

    if ( req.body.code_type == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Type of Article : Fail - Missing Fields");      
      }
    else
      {
        await TypeArticle.destroy<TypeArticle>({
          where: {
            code_type: req.body.code_type
          }
        }).then(function(dataTypeItem) { // dataTypeItem beacause sonarcloud logic
          if(dataTypeItem == 0)
            {
              res.status(404).end();
              log.info("Delete Type of Article : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Type of Article : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete Type of Article : Fail - ERROR");
          log.error(err);
        });
      }
  }

}