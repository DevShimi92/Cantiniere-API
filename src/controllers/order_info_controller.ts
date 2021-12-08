import { Request, Response } from "express";
import { log } from "../config/log_config";
import { OrderInfo } from "../models/order_info";
import { User } from "../models/user";
import { MailController } from './mail_controller';
import { SettingController } from './setting_controller';

function erreurToSend(res: Response, dataNotOk:boolean, canOrder:boolean, NBOrderLimit:boolean, thisAccountCanOrder:boolean, canPreOrderIfOn:boolean) {

  if(dataNotOk)
    {

      if(!canPreOrderIfOn)
            {
              log.error("Create Order : Fail - Unauthorized order date ");
              res.status(403).end();
            }
          else
            {
              log.error("Create Order : Fail - Data user not found");
              res.status(403).end();            
            }
      
        }
  else
    {

      if(!canOrder)
          {
            log.error("Create Order : Fail - Order time exceeded");
            res.status(403).json({ error : "Order time exceeded" });
          }
        else if(!NBOrderLimit)
          {
            log.error("Create Order : Fail - Limit Order exceeded ");
            res.status(403).json({ error : "Limit Order exceeded" });
          }
        else if(!thisAccountCanOrder)
          {
            log.error("Create Order : Fail - Limit Order for this account exceeded ");
            res.status(403).json({ error : "Limit Order for this account exceeded" });
          }
        else
          {
            log.error("Create Order : Fail - Insufficient balance or balance incorrect");
            res.status(403).json({ error : "Insufficient balance or balance incorrect" });
          }
    }
}

export class OrderInfoController {

   /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

   /**
   * @apiDefine OrderInfoFatalError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {post} /order Create Order Info
   * @apiName PostOrderInfo
   * @apiGroup OrderInfo
   * 
   * @apiBody {Number} id_client ID Client.
   * @apiBody {Date} date_order Date of Order.
   * @apiBody {Number} sold_before_order The sold of client before order.
   * @apiBody {Number} total The total of order.
   * 
   * @apiSuccess (Success 200) {Number} id ID of Order Info.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 200 OK
   *      {
   *         id : 1
   *      }
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly The value <code>id_client</code>, <code>sold_before_order</code> or <code>total</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError ProblemWithOrder Unauthorized order date or Data user not found.
   * 
   * @apiErrorExample 403-Error-Response :
   *     HTTP/1.1 403 Forbidden
   * 
   * @apiError TimeExceeded Order time exceeded.
   * 
   * @apiErrorExample 403-Error-Response :
   *     HTTP/1.1 403 Forbidden
   *      {
   *        "error": "Order time exceeded"
   *      }
   * 
     * @apiError LimitExceeded Limit Order exceeded.
   * 
   * @apiErrorExample 403-Error-Response :
   *     HTTP/1.1 403 Forbidden
   *      {
   *        "error": "Limit Order exceeded"
   *      }
   * 
   * @apiError LimitExceededAccount Order for this account exceeded.
   * 
   * @apiErrorExample 403-Error-Response :
   *     HTTP/1.1 403 Forbidden
   *      {
   *        "error": "Limit Order for this account exceeded"
   *      }
   * 
   * @apiError ProblemWithBalance Insufficient balance or balance incorrect.
   * 
   * @apiErrorExample 403-Error-Response :
   *     HTTP/1.1 403 Forbidden
   *      {
   *        "error": "Insufficient balance or balance incorrect"
   *      }
   * 
   * @apiUse OrderInfoFatalError
   * 
   */
  public async createOrder(req: Request,res: Response) : Promise<void> {
    log.info("Create Order");

    if ( req.body.id_client == null || req.body.sold_before_order == null || req.body.total == null) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Create Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_client) || isNaN(req.body.sold_before_order) || isNaN(req.body.total))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Create Order : Fail - The value is not number"); 
      }
    else
    {
        const dataclient = await User.findOne({ attributes : ['money','email'], where: { id: req.body.id_client } });

        const canOrder = await SettingController.checkHourLimit();

        const NBOrderLimit = await SettingController.checkTotalOrderLimitDay();

        const thisAccountCanOrder = await SettingController.checkTotalOrderLimitAccountDay(req.body.id_client);

        const canPreOrderIfOn = await SettingController.checkPreOrder(req.body.date_order);

        if (dataclient != null && canPreOrderIfOn) {
          
          if((dataclient.money >= req.body.total) && ( dataclient.money == req.body.sold_before_order) && canOrder && NBOrderLimit && thisAccountCanOrder)
            {

              await User.update({ money: dataclient.money-req.body.total }, {
                where: {
                  id: req.body.id_client
                }
              }).then(async () => {
                log.info("Create Order : User debit - succes");

                await OrderInfo.create<OrderInfo>({  id_client: req.body.id_client, date_order: req.body.date_order,sold_before_order: req.body.sold_before_order, total: req.body.total})
                .then(async (data) => {
                  res.status(200).json({ id : data.get('id')}).end();

                  await MailController.mailConfirmedOrder(dataclient.email);

                  log.info("Create Order : OK");
                  
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Order : Fail - ERROR");
                  log.error(err);
                });

              })
              .catch((err: Error) => {
                res.status(500).end();
                log.error("Create Order : ERROR - Can't update solde of user");
                log.error(err);
              });

            }
          else
            {
              erreurToSend(res,false,canOrder, NBOrderLimit, thisAccountCanOrder, canPreOrderIfOn);  
            }
         
        }
        else
        {

          erreurToSend(res,true,canOrder, NBOrderLimit, thisAccountCanOrder, canPreOrderIfOn);    
       
        }

    }
  }

  /**
   * @api {post} /order/:id_client Get Order Info
   * @apiName GetOrderInfo
   * @apiGroup OrderInfo
   * 
   * @apiParam {Number} id_client ID Client.
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data List of Order Info (Array of Objects).
   * @apiSuccess {Number}   data.id          ID of Order Info.
   * @apiSuccess {Date}     data.createdAt   Date of create of order info.
   * @apiSuccess {Number}   data.total       Total of order.
   * @apiSuccess {boolean}  data.done        Status of order. 
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *      [{
   *         id : 1,
   *         createdAt : '2021-12-08T15:27:27.245Z',
   *         total : 1,
   *         done : false
   *      }]
   * 
   * @apiError {String} NumberOnly The value <code>id_client</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse OrderInfoFatalError
   * 
   */
  public async getOrder(req: Request,res: Response) : Promise<void> {
    log.info("Get Order")

     if (!Number(req.params.id_client))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Get Order : Fail - The value is not number"); 
      }
    else
      {
            await OrderInfo.findAll<OrderInfo>({
              attributes : ['id','createdAt','total','done'],
              raw: true,
              where: {
                id_client: req.params.id_client
              },
            }).then(function(dataOrder) { 
        
              if(dataOrder.length == 0)
                {
                  res.status(204).end();
                }
              else
                {
                  res.status(200).json(dataOrder).end();
                }
        
              log.info("Get Order : OK");
            
            }).catch((err: Error) => {
                      res.status(500).end();
                      log.error("Get Order : Fail - ERROR");
                      log.error(err);
                    });
      }
  }

  /**
   * @api {delete} /order Delete Order Info
   * @apiName DeleteOrderInfo
   * @apiGroup OrderInfo
   * @apiPermission admin
   * 
   * @apiParam {Number} id_order ID Order Info.
   * 
   * @apiSuccess (Success 204) NoContent Order Info deleted.
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
   * @apiError {String} NumberOnly The value <code>id_order</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Order Info not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse OrderInfoFatalError
   * 
   */
  public async deleteOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Order");

    if ( req.body.id_order == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) )
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Delete Order : Fail - The value is not number"); 
      }
    else
      {

        await OrderInfo.findOne<OrderInfo>({
          attributes : ['id','id_client','total'],
          raw: true,
          where: {
            id: req.body.id_order
          },
        }).then(async (dataOrder) => {

          if(dataOrder != null)
            {

              const dataclient = await User.findOne({ attributes : ['money','email'], where: { id: dataOrder.id_client } });

              if(dataclient != null)
              {
                
                  await User.update({ money: dataclient.money+dataOrder.total },{
                    where: {
                      id: dataOrder.id_client
                    }
                  }).then(async ()=>{

                    await OrderInfo.destroy<OrderInfo>({
                      where: {
                        id: req.body.id_order
                      }
                    }).then(async ()=>{

                      res.status(204).end();
                      log.info("Delete Order : OK");
                      await MailController.mailCancelOrder(dataclient.email);

                    }).catch((errDestroy: Error) => {
                      res.status(500).end();
                      log.error("Delete Order : Fail - ERROR");
                      log.error(errDestroy);
                  });
                    
                  }).catch((errUpdate: Error) => {
                    res.status(500).end();
                    log.error("Delete Order : Fail - ERROR");
                    log.error(errUpdate);
                });

              }

            }
          else
            {
              res.status(404).end();
              log.info("Delete Order : Fail - Not found");
            }

        }).catch((err: Error) => {
              res.status(500).end();
              log.error("Delete Order : Fail - ERROR");
              log.error(err);
          });

      } 
  }

  /**
   * @api {put} /order/valid Put Valid Order
   * @apiName PutValidOrder
   * @apiGroup OrderInfo
   * @apiPermission admin
   * 
   * @apiBody {Number} id_order ID Order Info.
   * 
   * @apiSuccess (Success 204) NoContent Order Info deleted.
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
   * @apiError {String} NumberOnly The value <code>id_order</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Order Info not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse OrderInfoFatalError
   * 
   */
  public async validOrder(req: Request,res: Response): Promise<void>{

    log.info("Valid Order");

    if ( req.body.id_order == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Valid Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) )
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Valid Order : Fail - The value is not number"); 
      }
    else
      {

        await OrderInfo.findOne<OrderInfo>({
          attributes : ['id_client'],
          raw: true,
          where: {
            id: req.body.id_order
          },
        }).then(async (dataOrder) => {

          if(dataOrder)
            {

                  const dataclient = await User.findOne({ attributes : ['email'], where: { id: dataOrder.id_client } });
                  
                  if(dataclient)
                    await MailController.mailOrderReady(dataclient.email);

                  await OrderInfo.update({ done : true }, {
                    where: {
                      id: req.body.id_order
                    }
                  }).then(()=>{
          
                    res.status(204).end();
                    log.info("Valid Order : OK");
          
                  }).catch((errUpdate: Error) => {
                    res.status(500).end();
                    log.error("Valid Order : Fail - ERROR");
                    log.error(errUpdate);
                });

            }
          else
            {
              res.status(404).end();
              log.error("Valid Order : Fail - Order not found");
            }


        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Valid Order : Fail - ERROR");
          log.error(err);
      });

      }

  }

  /**
   * @api {get} /orderRecap/list/:date Get All Order For One Day
   * @apiName GetAllOrderForOneDay
   * @apiGroup OrderInfo
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
   * @apiSuccess {Number}   data.id               ID of Order.
   * @apiSuccess {Number}   data.id_client        ID client linked with the order.   
   * @apiSuccess {boolean}   data.done             Status of Order.   
   * @apiSuccess {String}   data.first_name       First name of client.  
   * @apiSuccess {String}   data.last_name        Last name of client.
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     [{ 
   *             "id" : 1 ,
   *             "id_client": 1, 
   *             "done" : false, 
   *             "first_name": "Louis", 
   *             "last_name" : "PASTATA" 
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
   * @apiUse OrderInfoFatalError
   * 
   */
  public async getAllOrderForOneDay (req: Request,res: Response) : Promise<void> {
    log.info("Get all Order for one day");
    
    let exp = RegExp("^([\\d][\\d][\\d][\\d]-[\\d][\\d]-[\\d][\\d])$");
    let regexp = new RegExp (exp);

    if (!regexp.test(req.params.date) || req.params.date.length != 10 ) 
      {
            res.status(400).json({ error : "Missing Fields or Bad format" }).end();
            log.error("Get All Order for one day : Fail - Missing Fields or Bad format");      
      }
    else
      {
          await OrderInfo.findAll<OrderInfo>({
            attributes : ['id','id_client','done'],
            raw: true,
            include: [
              {model: User, attributes: ['first_name','last_name']}
            ],
            where: {
              date_order : req.params.date
            }
          }).then((dataAllOrder)=>{
              if(dataAllOrder.length == 0)
                {
                  res.status(204).end();
                }
            else
              {
                res.status(200).json(dataAllOrder).end();
              }

          }).catch((error: Error)=>{
              res.status(500).end();
              log.error("Get All Order for one day : Fail - ERROR");
              log.error(error);
          });

      }

    }
}