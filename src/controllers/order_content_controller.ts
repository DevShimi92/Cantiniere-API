import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { OrderInfo } from "../models/order_info";
import { OrderContent } from "../models/order_content";
import { MenuInfo } from "../models/menu_info";
import { Sequelize } from "sequelize";

export class OrderContentController {

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

   /**
   * @apiDefine OrderContentFatalError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {get} /order/:id_client Get Order Content
   * @apiName GetOrderContent
   * @apiGroup OrderContent
   * 
   * @apiParam {Number} id_order ID Order Info.
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data List of Order Info (Array of Objects).
   * @apiSuccess {Number}   data.price                            Actual price of article in case of modification (otherwise is null)..
   * @apiSuccess {Number}   data.origin_price                     Original price of article in case of modification.
   * @apiSuccess {Number}   data.discout                          Discout on the price of article.
   * @apiSuccess {Number}   data.OrderInfo_id_client              ID Client.
   * @apiSuccess {Number}   data.OrderInfo_sold_before_order      The sold of client before order.
   * @apiSuccess {Number}   data.OrderInfo_total                  The total of order.
   * @apiSuccess {Number}   data.Article_name                     Name of article.
   * @apiSuccess {Number}   data.Article_code_type_src            Code type used for this article.
   * @apiSuccess {Number}   data.Article_price                    Price of article.
   * @apiSuccess {Number}   data.MenuInfo_id                      ID Menu Info.
   * @apiSuccess {Number}   data.MenuInfo_name                    Name of menu.
   * @apiSuccess {Number}   data.MenuInfo_price_final             Price final of menu.
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *      [{
   *           "price": null,
   *           "origin_price": null,
   *           "discout": 0,
   *           "OrderInfo.id_client": 1,
   *           "OrderInfo.sold_before_order": 200,
   *           "OrderInfo.total": 2.5,
   *           "Article.name": "Coca-cola",
   *           "Article.code_type_src": 1,
   *           "Article.price": 1.5,
   *           "MenuInfo.id": null,
   *           "MenuInfo.name": null,
   *           "MenuInfo.price_final": null
   *         },{
   *           "price": null,
   *           "origin_price": null,
   *           "discout": 0,
   *           "OrderInfo.id_client": 1,
   *           "OrderInfo.sold_before_order": 200,
   *           "OrderInfo.total": 2.5,
   *           "Article.name": "Baguette",
   *           "Article.code_type_src": 2,
   *           "Article.price": 1,
   *           "MenuInfo.id": null,
   *           "MenuInfo.name": null,
   *           "MenuInfo.price_final": null
   *         }]
   * 
   * @apiError {String} NumberOnly The value <code>id_order</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse OrderContentFatalError
   * 
   */
  public async getOrderContent(req: Request,res: Response) : Promise<void> {
    log.info("Get Order Content")

    if (!Number(req.params.id_order))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Get Order Content : Fail - The value is not number"); 
      }

      await OrderContent.findAll<OrderContent>({
        attributes : ['price','origin_price','discout'],
        raw: true,
        include: [
          {model: OrderInfo, attributes: ['id_client','sold_before_order','total']},
          {model: Article, attributes: ['name','code_type_src','price']},
          {model: MenuInfo, attributes: ['id','name','price_final']}
        ],
        where: {
          id_order: req.params.id_order
        },
      }).then(function(dataOrderContent) { 

      if(dataOrderContent.length == 0)
        {
          res.status(204).end();
        }
      else
        {
          res.status(200).json(dataOrderContent).end();
        }

      log.info("Get Order Content : OK");
    
    }).catch((err: Error) => {
              res.status(500).end();
              log.error("Get Order Content : Fail - ERROR");
              log.error(err);
            });

  }

  /**
   * @api {post} /order/content Post Order Content
   * @apiName PostOrderContent
   * @apiGroup OrderContent
   * 
   * @apiBody {Number} id_order    ID Order Info.
   * @apiBody {Number} id_article  ID Article.
   * @apiBody {Number} [id_menu]   ID Menu Info.
   * 
   * 
   * @apiSuccess (Success 204) NoContent OrderContent added.
   * 
   * @apiSuccessExample Success-Response-Empty :
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
   * @apiError {String} NumberOnly The value <code>id_order</code>, <code>id_article</code>or <code>id_menu</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse OrderContentFatalError
   * 
   */
  public async addToOrder(req: Request,res: Response) : Promise<void> {
    log.info("Add Article to Order");

    if ( req.body.id_order == null  || (req.body.id_article == null && req.body.id_menu == null ) ) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Add Article to Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) || (isNaN(req.body.id_article) && req.body.id_article!=null) || (isNaN(req.body.id_menu) && req.body.id_menu!=null) )
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Add Article to Order : Fail - The value is not number"); 
      }
    else
    {
        await OrderContent.create<OrderContent>({  id_order: req.body.id_order, id_article: req.body.id_article, id_menu: req.body.id_menu})
            .then(() => {
              res.status(204).end();
              log.info("Add Article to Order : OK");
            })
            .catch((err: Error) => {
              res.status(500).end();
              log.error("Add Article to Order : Fail - ERROR");
              log.error(err);
            });
    }
  }

  /**
   * @api {delete} /order/content Delete Order Content
   * @apiName DeleteOrderContent
   * @apiGroup OrderContent
   * @apiPermission admin
   * 
   * @apiBody {Number} id_order    ID Order Info.
   * @apiBody {Number} id_article  ID Article.
   * @apiBody {Number} id_menu   ID Menu Info.
   * 
   * 
   * @apiSuccess (Success 204) NoContent OrderContent deleted.
   * 
   * @apiSuccessExample Success-Response-Empty :
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
   * @apiError {String} NumberOnly The value <code>id_order</code>, <code>id_article</code>or <code>id_menu</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Order Content not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse OrderContentFatalError
   * 
   */
  public async deleteToOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article to Order");

    let id_menu = null;

    if ( req.body.id_order == null || (req.body.id_article == null && req.body.id_menu == null )) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete Article to Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) || (isNaN(req.body.id_article) && req.body.id_article!=null) || (isNaN(req.body.id_menu) && req.body.id_menu!=null) )
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Delete Article to Order : Fail - The value is not number"); 
      }
    else
      {

        if(req.body.id_menu != null)
            id_menu = req.body.id_menu;
            
        await OrderContent.destroy<OrderContent>({
          where: {
            id_article: req.body.id_article,
            id_order: req.body.id_order,
            id_menu: id_menu,
          }
        }).then(function(dataOrderContent) { 
          if(dataOrderContent == 0)
            {
              res.status(404).end();
              log.info("Delete Article to Order : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Article to Order : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete Article to Order : Fail - ERROR");
          log.error(err);
        });
      }
  }

  /**
   * @api {get} /orderRecap/:date Get Recap Order
   * @apiName GetRecapOrder
   * @apiGroup OrderContent
   * @apiPermission admin
   * 
   * @apiParam {Date} date Date of order.
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data                  List of Order (Array of Objects).
   * @apiSuccess {Number}   data.id_article               ID of article.
   * @apiSuccess {Number}   data.nombre                   Number of article in total for the day.
   * @apiSuccess {String}   data.Article_name             Name of article.
   * @apiSuccess {Date}     data.OrderInfo_date_order     Date of article. 
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     [{ 
   *             "id_article" : 1 ,
   *             "nombre": 1, 
   *             "Article.name" : 'Coca-cola', 
   *             "OrderInfo.date_order": "2021-12-08"
   *       },
   *      { 
   *             "id_article" : 2 ,
   *             "nombre": 1, 
   *             "Article.name" : 'Baguette', 
   *             "OrderInfo.date_order": "2021-12-08"
   *       }]
   * 
   * 
   * @apiError {String} MissingFields The date is missing or the date is not formated.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields or Bad format"
   *     }
   * 
   * @apiUse OrderContentFatalError
   * 
   */
  public async recapOrder(req: Request,res: Response) : Promise<void> {
    log.info("Get Recap Order for one day");

    let exp = RegExp("^([\\d][\\d][\\d][\\d]-[\\d][\\d]-[\\d][\\d])$");
    let regexp = new RegExp (exp);

    if ( !regexp.test(req.params.date) || req.params.date.length != 10 ) 
      {
            res.status(400).json({ error : "Missing Fields or Bad format" }).end();
            log.error("Get All Order for one day : Fail - Missing Fields or Bad format");      
      }
    else
      {

          await OrderContent.findAll<OrderContent>({
            attributes : ['id_article', [Sequelize.fn('COUNT', Sequelize.col('OrderContent.id_article')), 'nombre']],
            raw: true,
            group: ['id_article','name','OrderInfo.date_order'],
            include: [
              {model: Article, attributes: ['name']},
              {model: OrderInfo, attributes: ['date_order'],
                where: {
                  date_order : req.params.date
                }
              }
            ],
          }).then((dataRecapOrder) => {

            if(dataRecapOrder.length == 0) 
                {
                  res.status(204).end();
                }
              else
                {
                  res.status(200).json(dataRecapOrder).end();
                }

              log.info("Recap Order for today : OK");

            }).catch((err: Error) => {
              res.status(500).end();
              log.error("Recap Order for today : Fail - ERROR");
              log.error(err);
            });

      }
  }

}