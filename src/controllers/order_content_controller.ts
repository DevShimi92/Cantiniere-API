import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { OrderInfo } from "../models/order_info";
import { OrderContent } from "../models/order_content";
import { MenuInfo } from "../models/menu_info";
import { Sequelize } from "sequelize";

export class OrderContentController {

  public async getOrderContent(req: Request,res: Response) : Promise<void> {
    log.info("Get Order Content")

    if (!Number(req.params.id_order))
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
          {model: Article, attributes: ['name','code_type_src','price']},
          {model: MenuInfo, attributes: ['id','name','price_final']}
        ],
        where: {
          id_order: req.params.id_order
        },
      }).then(function(dataOrderContent) { 

      if(dataOrderContent.length == 0) // dataOrderContent beacause sonarcloud logic
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

  public async deleteToOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article to Order");

    let id_menu = null;

    if ( req.body.id_order == null || (req.body.id_article == null && req.body.id_menu == null )) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Article to Order : Fail - Missing Fields");      
      }
    else if ( isNaN(req.body.id_order) || (isNaN(req.body.id_article) && req.body.id_article!=null) || (isNaN(req.body.id_menu) && req.body.id_menu!=null) )
      {
            res.status(400).json({ error : "Number only" });
            res.end();
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

  public async recapOrder(req: Request,res: Response) : Promise<void> {
    log.info("Get Recap Order for today");
    let today = new Date;
    let DateToday = today.toISOString().slice(0, 10);

    await OrderContent.findAll<OrderContent>({
      attributes : ['id_article', [Sequelize.fn('COUNT', Sequelize.col('OrderContent.id_article')), 'nombre']],
      raw: true,
      group: ['id_article','name','OrderInfo.date_order'],
      include: [
        {model: Article, attributes: ['name']},
        {model: OrderInfo, attributes: ['date_order'],
          where: {
            date_order : DateToday
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