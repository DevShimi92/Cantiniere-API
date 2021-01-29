import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { MenuInfo } from "../models/menu_info";
import { MenuContent } from "../models/menu_content";

export class MenuContentController {

  public async getMenu(req: Request,res: Response) : Promise<void> {
    log.info("Get Menu")

    if ( req.body.id_menu == null ) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Get Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_menu))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Get Menu : Fail - The value is not number"); 
      }

    await MenuContent.findAll<MenuContent>({
      attributes : ['id_menu','id_article'],
      raw: true,
     include: [
      {model: MenuInfo, attributes: ['name','description','price_final']}, 
      {model: Article, attributes: ['name','code_type_src','price']} 
    ],
     where: {
      id_menu: req.body.id_menu
    },
    }).then(function(data) { 

      if(data.length == 0)
        {
          res.status(204).end();
        }
      else
        {
          res.status(200).json(data).end();
        }

      log.info("Get Menu : OK");
    
    }).catch((err: Error) => {
              res.status(500).end();
              log.error("Get Menu : Fail - ERROR");
              log.error(err);
            });

  }

  public async addToMenu(req: Request,res: Response) : Promise<void> {
    log.info("Add Article to Menu");

    if ( req.body.id_article == null || req.body.id_menu == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Add Article to Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_article) || isNaN(req.body.id_menu) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Add Article to Menu : Fail - The value is not number"); 
      }
    else
    {
        await MenuContent.create<MenuContent>({  id_menu: req.body.id_menu, id_article: req.body.id_article})
            .then(() => {
              res.status(204).end();
              log.info("Add Article to Menu : OK");
            })
            .catch((err: Error) => {
              res.status(500).end();
              log.error("Add Article to Menu : Fail - ERROR");
              log.error(err);
            });
    }
  }

  public async deleteToMenu(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article to Menu");

    if ( req.body.id_article == null || req.body.id_menu == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Article to Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_article) || isNaN(req.body.id_menu) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete Article to Menu : Fail - The value is not number"); 
      }
    else
      {
        await MenuContent.destroy<MenuContent>({
          where: {
            id_article: req.body.id_article,
            id_menu: req.body.id_menu,
          }
        }).then(function(dataMenuContent) {  // dataMenuContent beacause sonarcloud logic
          if(dataMenuContent == 0)
            {
              res.status(404).end();
              log.info("Delete Article to Menu : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Article to Menu : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete Article to Menu : Fail - ERROR");
          log.error(err);
        });
      }
  }

}