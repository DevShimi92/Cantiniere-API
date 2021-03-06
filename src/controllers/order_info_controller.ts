import { Request, Response } from "express";
import { log } from "../config/log_config";
import { OrderInfo } from "../models/order_info";
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

        if (dataclient != null ) {
          
          if((dataclient.money >= req.body.total) && ( dataclient.money == req.body.sold_before_order) && canOrder )
            {

              await User.update({ money: dataclient.money-req.body.total }, {
                where: {
                  id: req.body.id_client
                }
              }).then(async () => {
                log.info("Create Order : User debit - succes");

                await OrderInfo.create<OrderInfo>({  id_client: req.body.id_client, sold_before_order: req.body.sold_before_order, total: req.body.total})
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
              res.status(403).end();
              if(canOrder)
                {
                  log.error("Create Order : Fail - Insufficient balance or balance incorrect");
                }
              else
                {
                  log.error("Create Order : Fail - Order time exceeded");
                }
              
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

}