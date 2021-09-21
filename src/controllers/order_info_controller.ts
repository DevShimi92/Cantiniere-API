import { Request, Response } from "express";
import { log } from "../config/log_config";
import { OrderInfo } from "../models/order_info";
import { OrderContent } from "../models/order_content";
import { User } from "../models/user";
import { MailController } from './mail_controller';
import { SettingController } from './setting_controller';

export class OrderInfoController {

  public async createOrder(req: Request,res: Response) : Promise<void> {
    log.info("Create Order");

    if ( req.body.id_client == null || req.body.sold_before_order == null || req.body.total == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Create Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_client) || isNaN(req.body.sold_before_order) || isNaN(req.body.total))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
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
        else
        {
          res.status(403).end();
          if(!canPreOrderIfOn)
            {
              log.error("Create Order : Fail - Unauthorized order date ");
            }
          else
            {
              log.error("Create Order : Fail - Data user not found");
            }
        }

    }
  }

  public async getOrder(req: Request,res: Response) : Promise<void> {
    log.info("Get Order")

     if (!Number(req.params.id_client))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
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

  public async deleteOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Order");

    if ( req.body.id_order == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
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
                        id: dataOrder.id_client
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

  public async validOrder(req: Request,res: Response): Promise<void>{

    log.info("Valid Order");

    if ( req.body.id_order == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Valid Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
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

  public async getAllOrderForToday (req: Request,res: Response) : Promise<void> {
    log.info("Get all Order for today");

    let today = new Date;
    let DateToday = today.toISOString().slice(0, 10);

    await OrderInfo.findAll<OrderInfo>({
      attributes : ['id','id_client','done'],
      raw: true,
      include: [
        {model: User, attributes: ['first_name','last_name']}
      ],
      where: {
        date_order : DateToday
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
        log.error("Get All Order for today : Fail - ERROR");
        log.error(error);
    });

    res.status(204).end();
  }

}