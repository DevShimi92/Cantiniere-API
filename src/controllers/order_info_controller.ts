import { Request, Response } from "express";
import { log } from "../config/log_config";
import { OrderInfo } from "../models/order_info";

export class OrderInfoController {

  public async createOrder(req: Request,res: Response) : Promise<void> {
    log.info("Create Order");

    if ( req.body.id_client == null || req.body.sold_before_order == null || req.body.total == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Create Order : Fail - Missing Fields");      
      }
    else
    {
        await OrderInfo.create<OrderInfo>({  id_client: req.body.id_client, sold_before_order: req.body.sold_before_order, total: req.body.total})
            .then(() => {
              res.status(204).end();
              log.info("Create Order : OK");
            })
            .catch((err: Error) => {
              res.status(500).end();
              log.error("Create Order : Fail - ERROR");
              log.error(err);
            });
    }
  }

  public async getOrder(req: Request,res: Response) : Promise<void> {
    log.info("Get Order")

    await OrderInfo.findAll<OrderInfo>({
      attributes : ['id','id_client','sold_before_order','total'],
      raw: true,
      where: {
        id_client: req.params.id
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

  public async deleteOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Order");
        await OrderInfo.destroy<OrderInfo>({
          where: {
            id: req.params.id
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