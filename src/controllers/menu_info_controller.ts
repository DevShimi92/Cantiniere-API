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

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

  /**
   * @apiDefine MenuError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   * 
   */

  /**
   * @api {post} /menu Create  Menu 
   * @apiName PostMenu 
   * @apiGroup Menu
   * @apiDescription Warning : This request must be send in **content-type**.
   * @apiPermission admin
   * 
   * @apiBody {String} name            Name of menu.
   * @apiBody {Number} [price_final]   Price of menu.
   * @apiBody {String} [description]   Description of menu.
   * @apiBody {File}   [img]           Image of menu.
   * 
   * @apiSuccess (Success 201) {Number} Id of Menu created.
   * 
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       id : 1
   *     }
   * 
   * @apiError {String} MissingFields The fields <code>name</code> are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>price_final</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse MenuError
   * 
   */
  public async createMenu(req: Request, res: Response) : Promise<void> {
    log.info("Create Menu");

    if (req.body.name == null )
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Create Menu : Fail - Missing Fields");      
      }
    else if( req.body.price_final != null && isNaN(req.body.price_final))
      {
            res.status(400).json({ error : "Number only" }).end();
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
                      res.status(201).json({ id : data.get('id')}).end();
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

  /**
   * @api {post} /menu Get all Menu 
   * @apiName GetMenu 
   * @apiGroup Menu
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data                  List of menu (Array of Objects).
   * @apiSuccess {Number}   data.id               ID of menu.
   * @apiSuccess {String}   data.name             Name of menu.    
   * @apiSuccess {Number}   data.price_final      Price final of menu.   
   * @apiSuccess {String}   data.picture          Picture of menu.  
   * @apiSuccess {String}   data.description      Description of menu.
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     [{ 
   *            "id": 1, 
   *            "name": 'Menu', 
   *            "price_final": 0, 
   *            "description": null, 
   *            "picture": null
   *      }]
   * 
   * @apiUse MenuError
   * 
   */
  public async getAllMenu(_req: Request,res: Response) : Promise<void> {
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

  /**
   * @api {put} /menu Put Menu 
   * @apiName PutMenu 
   * @apiGroup Menu
   * @apiPermission admin
   *  
   * @apiBody {Number} id                ID of menu.
   * @apiBody {String} [name]            Name of menu.
   * @apiBody {Number} [price_final]     Price of menu.
   * @apiBody {String} [description]     Description of menu.
   * 
   * @apiSuccess (Success 204) NoContent Update of menu done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {string} MissingFields The value <code>id</code> is missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {string} NumberOnly The value <code>id</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Menu not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiError Conflict Some Fields can't update.
   * 
   * @apiErrorExample 409-Error-Response :
   *     HTTP/1.1 409 Conflict
   *
   */
  public async updateMenu(req: Request, res: Response) : Promise<void> {
    log.info("Update Menu");
    
    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update Menu : Fail - Missing Fields");      
      }
      else if ( isNaN(req.body.id) )
      {
            res.status(400).json({ error : "Number only" }).end();
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
          res.status(404).json().end();
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
            res.status(204).end();
            log.info("Update Menu : OK");
            UpdateOk=0;
          }
        else
          {
            res.status(409).end();
            log.warn("Update Menu : OK with error - "+UpdateOk+' update done only');
            UpdateOk=0;
            errorUpdate=false;
          }

      }

    }

  }

  /**
   * @api {delete} /menu Delete Menu 
   * @apiName DeleteMenu 
   * @apiGroup Menu
   * @apiPermission admin
   *  
   * @apiBody {Number} id   ID of menu.
   * 
   * @apiSuccess (Success 204) NoContent Menu deleted.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {string} MissingFields The value <code>id</code> is missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {string} NumberOnly The value <code>id</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Menu not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse MenuError
   * 
   */
  public async deleteMenu(req: Request,res: Response) : Promise<void> {
    log.info("Delete Menu");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id) )
      {
            res.status(400).json({ error : "Number only" }).end();
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