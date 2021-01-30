import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { OrderInfo } from "../models/order_info";
import { OrderContent } from "../models/order_content";

export class OrderContentController {

  public async getOrderContent(req: Request,res: Response) : Promise<void> {
    log.info("Get Order Content")

    if ( req.body.id_order == null ) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Get Order Content : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Get Order Content : Fail - The value is not number"); 
      }

      await OrderContent.findAll<OrderContent>({
        attributes : ['price','origin_price','discout'],
        raw: true,
        include: [
          {model: OrderInfo, attributes: ['id_client','sold_before_order','total']},
          {model: Article, attributes: ['name','code_type_src','price']}
        ],
        where: {
          id_order: req.body.id_order
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

      log.info("Get Order Content : OK");
    
    }).catch((err: Error) => {
              res.status(500).end();
              log.error("Get Order Content : Fail - ERROR");
              log.error(err);
            });

  }

  public async addToOrder(req: Request,res: Response) : Promise<void> {
    log.info("Add Article to Order");

    if ( req.body.id_article == null || req.body.id_order == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Add Article to Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_article) || isNaN(req.body.id_order) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Add Article to Order : Fail - The value is not number"); 
      }
    else
    {
        await OrderContent.create<OrderContent>({  id_order: req.body.id_order, id_article: req.body.id_article})
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

  public async deleteToOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article to Order");

    if ( req.body.id_article == null || req.body.id_order == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Article to Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_article) || isNaN(req.body.id_order) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Delete Article to Order : Fail - The value is not number"); 
      }
    else
      {
        await OrderContent.destroy<OrderContent>({
          where: {
            id_article: req.body.id_article,
            id_order: req.body.id_order,
          }
        }).then(function(dataOrderContent) {  // dataOrderContent beacause sonarcloud logic
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

}