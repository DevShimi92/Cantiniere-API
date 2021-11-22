import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { ImageController } from "./image_controller";

let errorUpdate : boolean = false;
let UpdateOk : number = 0;

async function compareAndUpdate(id:number, value:string, ColToChange:string) {

    if(value != null)
      {
        await Article.update({ [ColToChange] : value }, {
          where: {
            id: id
          }
        }).then(() => {
          UpdateOk++;
        })
        .catch((err: Error,) => {
          log.error('Error with field of Article : ' + err);
          errorUpdate=true;
            });
      }

}

export class ArticleController {

  public async createArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Article");
    if (req.body.name == null || req.body.price == null || req.body.code_type_src == null)
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.code_type_src) || isNaN(req.body.price))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Create Article : Fail - The value is not number"); 
      }
    else
      {
        if(req.body.description === 'null')
            {
              req.body.description = null;
            }
            
          await Article.create<Article>({ name: req.body.name, price : req.body.price, code_type_src: req.body.code_type_src, description: req.body.description})
              .then(async (data) => {

                  if(req.files?.length == 0 || req.files?.length == undefined)
                    {
                      log.warn("Create Article : Image not found.");
                      res.status(201).end();
                      log.info("Create Article : OK");
                    }
                  else
                    {
                      log.info("Create Article : Image found. Upload image");
                      await ImageController.imageProcessing(data.id,res,true);
                      res.status(201).end();
                      log.info("Create Article : OK");
                    }

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
        const NameOfCol: string[] = ['name', 'code_type_src', 'price', 'picture', 'description'];

        await compareAndUpdate(req.body.id,req.body.name,NameOfCol[0]);
        await compareAndUpdate(req.body.id,req.body.code_type_src,NameOfCol[1]);
        await compareAndUpdate(req.body.id,req.body.price,NameOfCol[2]);
        await compareAndUpdate(req.body.id,req.body.picture,NameOfCol[3]);
        await compareAndUpdate(req.body.id,req.body.description,NameOfCol[4]);

        if(!errorUpdate)
          {
            res.status(204);
            res.end();
            log.info("Update Article : OK");
            UpdateOk=0;
          }
        else
          {
            res.status(409);
            res.end();
            log.warn("Update Article : OK with error - "+UpdateOk+' update done only');
            UpdateOk=0;
            errorUpdate=false;
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
        }).then(function(dataArticle) { 
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