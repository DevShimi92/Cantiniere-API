import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { MenuInfo } from "../models/menu_info";
import { MenuContent } from "../models/menu_content";

export class MenuContentController {

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

  /**
   * @apiDefine MenuContentError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {get} /menu/content/:id_menu Get Menu Content
   * @apiName GetMenuContent
   * @apiGroup MenuContent
   * 
   * @apiParam  {Number} id_menu   ID du menu.
   * 
   * @apiParamExample {string} Request-Example:
   *     /menu/content/1
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data                        List of menu content(Array of Objects).
   * @apiSuccess {Number}   data.id                     ID of menu content.
   * @apiSuccess {Number}   data.id_menu                ID of menu.
   * @apiSuccess {Number}   data.id_article             ID of article.
   * @apiSuccess {String}   data.MenuInfo_Name          Name of menu.
   * @apiSuccess {String}   data.MenuInfo_Description   Description of menu.
   * @apiSuccess {Number}   data.MenuInfo_Price_final   Price final of menu.
   * @apiSuccess {String}   data.Article_Name           Name of article.
   * @apiSuccess {Number}   data.Article_Code_type_src  Code type of article.
   * @apiSuccess {Number}   data.Article_Price          Price of article.
   * @apiSuccess {String}   data.Article_Picture        Picture of article.
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *      [{
   *           "id": 1,
   *           "id_menu": 1,
   *           "id_article": 1,
   *           "MenuInfo.name": "Menu",
   *           "MenuInfo.description": null,
   *           "MenuInfo.price_final": 0,
   *           "Article.name": "Coca-cola",
   *           "Article.code_type_src": 1,
   *           "Article.price": 1.5,
   *           "Article.picture": null
   *       },
   *       {
   *           "id": 1,
   *           "id_menu": 1,
   *           "id_article": 2,
   *           "MenuInfo.name": "Menu",
   *           "MenuInfo.description": null,
   *           "MenuInfo.price_final": 0,
   *           "Article.name": "Baguette",
   *           "Article.code_type_src": 2,
   *           "Article.price": 1,
   *           "Article.picture": "https://urlToPictureOFaPain.com/image/baguette.jpeg"
   *       }]
   * 
   * 
   * @apiError {String} NumberOnly	The value <code>id_menu</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse MenuContentError
   */
  public async getMenu(req: Request,res: Response) : Promise<void> {
    log.info("Get Menu")
    
    if (!Number(req.params.id_menu))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Get Menu : Fail - The value is not number"); 
      }
    else
      {

        await MenuContent.findAll<MenuContent>({
          attributes : ['id','id_menu','id_article'],
          raw: true,
        include: [
          {model: MenuInfo, attributes: ['name','description','price_final']}, 
          {model: Article, attributes: ['name','code_type_src','price','picture']} 
        ],
        where: {
          id_menu: req.params.id_menu
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

  }

  /**
   * @api {post} /menu Post Menu Content
   * @apiName PostMenuContent
   * @apiGroup MenuContent
   * @apiPermission admin
   * 
   * @apiBody {Number} id_article   ID of article.
   * @apiBody {Number} id_menu      ID of menu.
   * 
   * @apiSuccess (Success 204) NoContent Update of content of menu done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>id_article</code> or <code>id_menu</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse MenuContentError
   */
  public async addToMenu(req: Request,res: Response) : Promise<void> {
    log.info("Add Article to Menu");

    if ( req.body.id_article == null || req.body.id_menu == null) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Add Article to Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_article) || isNaN(req.body.id_menu) )
      {
            res.status(400).json({ error : "Number only" }).end();
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

  /**
   * @api {delete} /menu Delete Menu Content
   * @apiName DeleteMenuContent
   * @apiGroup MenuContent
   * @apiPermission admin
   * 
   * @apiBody {Number} id           ID of menu content.
   * @apiBody {Number} id_article   ID of article.
   * @apiBody {Number} id_menu      ID of menu.
   * 
   * @apiSuccess (Success 204) NoContent Update of content of menu done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>id</code> or <code>id_article</code> or <code>id_menu</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Menu Content not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * 
   * @apiUse MenuContentError
   */
  public async deleteToMenu(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article to Menu");

    if ( req.body.id_article == null || req.body.id_menu == null || req.body.id == null) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete Article to Menu : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_article) || isNaN(req.body.id_menu) || isNaN(req.body.id) )
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Delete Article to Menu : Fail - The value is not number"); 
      }
    else
      {
        await MenuContent.destroy<MenuContent>({
          where: {
            id: req.body.id,
            id_article: req.body.id_article,
            id_menu: req.body.id_menu,
          }
        }).then(function(dataMenuContent) { 
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