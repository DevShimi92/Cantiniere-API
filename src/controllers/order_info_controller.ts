import { Request, Response } from "express";
import { log } from "../config/log_config";
import { OrderInfo } from "../models/order_info";
import { User } from "../models/user";

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
        const moneyInAccount = await User.findOne({ attributes : ['money'], where: { id: req.body.id_client } });

        if (moneyInAccount != null) {
          
          if((moneyInAccount.money >= req.body.total) && ( moneyInAccount.money == req.body.sold_before_order))
            {

              await User.update({ money: moneyInAccount.money-req.body.total }, {
                where: {
                  id: req.body.id_client
                }
              }).then(async () => {
                log.info("Create Order : User debit - succes");

                await OrderInfo.create<OrderInfo>({  id_client: req.body.id_client, sold_before_order: req.body.sold_before_order, total: req.body.total})
                .then((data) => {
                  res.status(200).json({ id : data.get('id')}).end();
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
              log.error("Create Order : Fail - Insufficient balance or balance incorrect");
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
              attributes : ['id','createdAt','total'],
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

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete Order : Fail - The value is not number"); 
      }
    else
      {
            await OrderInfo.destroy<OrderInfo>({
              where: {
                id: req.body.id
              }
            }).then(function(data) { 
              if(data == 0)
                {
                  res.status(404).end();
                  log.info("Delete Order : Fail - Not found");
                }
              else
              {
                  res.status(204).end();
                  log.info("Delete Order : OK");
              }
                
            }).catch((err: Error) => {
              res.status(500).end();
              log.error("Delete Order : Fail - ERROR");
              log.error(err);
            });
      } 
  }

}