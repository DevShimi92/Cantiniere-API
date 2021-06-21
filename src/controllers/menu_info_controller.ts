import { Request, Response } from "express";
import { log } from "../config/log_config";
import { MenuInfo } from "../models/menu_info";

export class MenuInfoController {

  public async createMenu(req: Request, res: Response) : Promise<void> {
    log.info("Create Menu");

    if (req.body.name == null )
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create Menu : Fail - Missing Fields");      
      }
    else if( req.body.price_final != null && isNaN(req.body.price_final))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Create Menu : Fail - The value of price_final is not number"); 
      }
    else
      {
        if(req.body.price_final == null)
          {
            req.body.price_final=0;
          }
            

          await MenuInfo.create<MenuInfo>({ name: req.body.name, description: req.body.description , price_final: req.body.price_final})
                .then((data) => {
                  res.status(200).json({ id : data.get('id')}).end();
                  log.info("Create Menu : OK");
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Menu : Fail - ERROR");
                  log.error(err);
                });
      }
    
  }

  public async getAllMenu(req: Request,res: Response) : Promise<void> {
    log.info("Get all Menu");

    await MenuInfo.findAll<MenuInfo>({
      attributes : ['id','name','description','price_final'],
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

      log.info("Get all Menu : OK");
    
    }).catch((err: Error) => {
      res.status(500).end();
      log.error("Get Menu : Fail - ERROR");
      log.error(err);
    });

  }

  public async updateMenu(req: Request, res: Response) : Promise<void> {
    log.info("Update Menu");
    
    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Menu : Fail - Missing Fields");      
      }
      else if ( isNaN(req.body.id) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Update Menu : Fail - The value is not number"); 
      }
    else
      {
      const idSearch = await MenuInfo.findAll<MenuInfo>({
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
          log.error("Update Menu : Fail - Menu not exist");      
        }
      else
      {
        let OK = 0;
        let Err = 0;

        if(req.body.name != null)
        {
          await MenuInfo.update({ name: req.body.name }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Err++;
            log.error('Error with field name of Menu : ' + err);
              });
          }

        if(req.body.price_final != null)
        {
          await MenuInfo.update({ price_final : req.body.price_final }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Err++;
            log.error('Error with field price_final of Menu : ' + err);
              });
        }

        if(req.body.description != null)
        {
          await MenuInfo.update({ description: req.body.description }, {
            where: {
              id: req.body.id
            }
          }).then(() => OK++)
          .catch((err: Error,) => {
            Err++;
            log.error('Error with field description of Menu : ' + err);
              });
        }

        if(Err == 0)
          {
            res.status(204);
            res.end();
            log.info("Update Menu : OK");
          }
        else
          {
            res.status(409);
            res.end();
            log.warn("Update Menu : OK with error - "+OK+' update done only');
          }

      }

    }

  }

  public async deleteMenu(req: Request,res: Response) : Promise<void> {
    log.info("Delete Menu");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete Menu : Fail - The value is not number"); 
      }
    else
      {
        await MenuInfo.destroy<MenuInfo>({
          where: {
            id: req.body.id
          }
        }).then(function(dataDeletMenu) { // dataDeletMenu beacause sonarcloud logic
          if(dataDeletMenu == 0)
            {
              res.status(404).end();
              log.info("Delete Menu : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Menu : OK");
          }
            
        }).catch((errMenu: Error) => {
          res.status(500).end();
          log.error("Delete Menu : Fail - ERROR");
          log.error(errMenu);
        });
      }
  }

}