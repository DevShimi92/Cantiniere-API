import { Request, Response } from "express";
import { log } from "../config/log_config";
import { MenuInfo } from "../models/menu_info";
import { ImageController } from "./image_controller";

let errorUpdate : boolean = false;
let UpdateOk : number = 0;

async function compareAndUpdate(id:number, value:string, ColToChange:string) {

  if(value != null)
    {
      await MenuInfo.update({ [ColToChange] : value }, {
        where: {
          id: id
        }
      }).then(() => {
        UpdateOk++;
      })
      .catch((err: Error,) => {
        log.error('Error with field of Menu : ' + err);
        errorUpdate=true;
          });
    }

}


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

          if(req.body.description === 'null')
            {
              req.body.description = null;
            }
            

          await MenuInfo.create<MenuInfo>({ name: req.body.name, description: req.body.description , price_final: req.body.price_final})
                .then((data) => {
                  
                  if(req.files?.length == 0 || req.files?.length == undefined)
                    {
                      log.warn("Create Menu : Image not found.");
                      res.status(201).json({ id : data.get('id')}).end();
                      log.info("Create Menu : OK");
                    }
                  else
                    {
                      log.info("Create Menu : Image found. Upload image");
                      ImageController.imageProcessing(data.id,res,false);
                      res.status(200).json({ id : data.get('id')}).end();
                      log.info("Create Menu : OK");
                    }
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
      attributes : ['id','name','description','price_final','picture'],
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
        const NameOfCol: string[] = ['name', 'price_final', 'description'];

        await compareAndUpdate(req.body.id,req.body.name,NameOfCol[0]);
        await compareAndUpdate(req.body.id,req.body.price_final,NameOfCol[1]);
        await compareAndUpdate(req.body.id,req.body.description,NameOfCol[2]);

        if(!errorUpdate)
          {
            res.status(204);
            res.end();
            log.info("Update Menu : OK");
            UpdateOk=0;
          }
        else
          {
            res.status(409);
            res.end();
            log.warn("Update Menu : OK with error - "+UpdateOk+' update done only');
            UpdateOk=0;
            errorUpdate=false;
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
        }).then(function(dataDeletMenu) {
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