import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Setting } from "../models/setting";
import { OrderInfo } from "../models/order_info";


export class SettingController {

  static async checkHourLimit() : Promise<boolean> {
    log.info("Check hour Limit");

    return Setting.findOne<Setting>({
      attributes : ['hour_limit'],
      raw: true,
    }).then(function(data) {

      let hourNow = new Date;
      let hourLimit = new Date;

      if(data != null)
      {
        const hour : number = parseInt(data.hour_limit.toString().slice(0, 2));
        const minute : number = parseInt(data.hour_limit.toString().slice(3, 5));
        const seconde : number = parseInt(data.hour_limit.toString().slice(6, 8));

        hourLimit.setHours(hour, minute, seconde);

        if(Date.parse(hourNow.toString()) > Date.parse(hourLimit.toString()))
          {
            return false;
          }
          else
          {
            return true;
          }

      }
      else
      {
        log.error("Paramètre non trouvé");
        return false;
      }

      
      
    });

  }

  static async getHourLimit(): Promise<string> {
    log.info("Get hour Limit");

    return Setting.findOne<Setting>({
      attributes : ['hour_limit'],
      raw: true,
    }).then(function(data) {
      
      if(data != null)
      {
        return data.hour_limit.toString();
      }
      else
      {
        log.error("Paramètre non trouvé");
        return 'ERROR';
      }

    });
  }
  
  public async updateHourLimit(req: Request,res: Response) : Promise<void> {

    log.info("Update hour Limit");

    var regexp = RegExp("^([0-1]?[0-9]:[0-9][0-9]:[0-9][0-9])|(2[0-3]:[0-9][0-9]:[0-9][0-9])");

    if ( req.body.hour_limit == null ) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update hour Limit : Fail - Missing Fields");      
      }
    else if (!regexp.test(req.body.hour_limit) || req.body.hour_limit.length != 8)
      {
            res.status(400).json({ error : "Not formated" });
            res.end();
            log.error("Update hour Limit : Fail - The value is not formated "); 
      }
    else
      {

      await Setting.update({ hour_limit: req.body.hour_limit }, {
        where: {
          id: 1
        }
      }).then(() => {
        res.status(200).end();
        log.info("Hour limit update: New hour is "+ req.body.hour_limit);
      })
      .catch((error) => {
        res.status(500).end();
        log.error("Update hour Limit : Fail : " + error);  
      });
    
    }
  }

  static async checkTotalOrderLimitDay () : Promise<boolean>{
    log.info("Check Total order limit of day ");

    let DateNow = new Date;
    let DateSting ;

    DateSting = DateNow.toISOString().slice(0, 10) ; 

    let OrderLimit = await Setting.findOne<Setting>({
      attributes : ['nb_limit_per_day'],
      raw: true,
    }).then(function(data){
      if(data != null)
      {
        return data.nb_limit_per_day;
      }
      else
      {
        return 0;
      }
    });

    return OrderInfo.findAll<OrderInfo>({
      raw: true,
      where: {
        date_order: DateSting
      }
    }).then(function(data) {

      if(OrderLimit == 0)
      {
        return false;
      }
      else if(data != null)
      {
        if(data.length <= OrderLimit) {
          return true;
        }
        else {
          return false;
        }

      }
      else
      {
        log.error("Paramètre non trouvé");
        return false;
      }
      
    });

  }

  static async getTotalOrderLimitDay () : Promise<string> {
    log.info("Get Total order limit ");

    return Setting.findOne<Setting>({
      attributes : ['nb_limit_per_day'],
      raw: true,
    }).then(function(data) {
      
      if(data != null)
      {
        return data.nb_limit_per_day.toString();
      }
      else
      {
        log.error("Paramètre non trouvé");
        return 'ERROR';
      }

    });

  }

  public async updateTotalOrderLimitDay (req: Request,res: Response) : Promise<void> {
    log.info("Update Total order limit ");

    if ( req.body.nb_limit_per_day == null ) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Total order limit : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.nb_limit_per_day))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Update Total order limit : Fail - The value is not a number "); 
      }
    else
      {

      await Setting.update({ nb_limit_per_day: req.body.nb_limit_per_day }, {
        where: {
          id: 1
        }
      }).then(() => {
        res.status(200).end();
        log.info("Total order limit update: New limit is "+ req.body.nb_limit_per_day);
      })
      .catch((error) => {
        res.status(500).end();
        log.error("Update Total order limit : Fail : " + error);  
      });
    
    }

  }

  static async checkTotalOrderLimitAccountDay (id_client : number) : Promise<boolean> {
    log.info("Check Total order limit of one account");

    let OrderAccountLimit = await Setting.findOne<Setting>({
        attributes : ['nb_limit_per_account'],
        raw: true,
      }).then(function(data){
        if(data != null)
        {
          return data.nb_limit_per_account;
        }
        else
        {
          return 0;
        }
      });

    return OrderInfo.findOne<OrderInfo>({
      raw: true,
      where: {
        id_client: id_client
      }
    }).then(function(data){
      if(data != null)
      {
        return false;
      }
      else
      {
        return true;
      }
    });

  }

  static async getTotalOrderLimitAccountDay (): Promise<string>{
    log.info("Get Total order limit per account");

    return Setting.findOne<Setting>({
      attributes : ['nb_limit_per_account'],
      raw: true,
    }).then(function(data) {
      
      if(data != null)
      {
        return data.nb_limit_per_account.toString();
      }
      else
      {
        log.error("Paramètre non trouvé");
        return 'ERROR';
      }

    });

  }

  public async updateTotalOrderLimitAccountDay (req: Request,res: Response) : Promise<void> {
    log.info("Update Total order limit per account");

    if ( req.body.nb_limit_per_account == null ) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Total order limit per account : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.nb_limit_per_account))
      {
            res.status(400).json({ error : "Number only" });
            res.end();
            log.error("Update Total order limit per account : Fail - The value is not a number "); 
      }
      else
        {

        await Setting.update({ nb_limit_per_account: req.body.nb_limit_per_account }, {
          where: {
            id: 1
          }
        }).then(() => {
          res.status(200).end();
          log.info("Total order limit per account update: New limit is "+ req.body.nb_limit_per_account);
        })
        .catch((error) => {
          res.status(500).end();
          log.error("Update Total order limit per account  : Fail : " + error);  
        });
      
      }

  }

  static async checkPreOrder(orderDate : string) : Promise<boolean> {
    log.info("Check Pre Order");

    let PreOrderValue = await Setting.findOne<Setting>({
        attributes : ['order_in_advance'],
        raw: true,
      }).then(function(data){
        if(data != null)
        {
          return data.order_in_advance;
        }
        else
        {
          return false;
        }
      });
      
      if(PreOrderValue == true)
        {
          return true;
        }
      else if(PreOrderValue == false && orderDate == undefined)
        {
          return true;
        }
      else
        {
          return false
        }

  }

  static async getPreOrder (): Promise<string>{
    log.info("Get Pre order");

    return Setting.findOne<Setting>({
      attributes : ['order_in_advance'],
      raw: true,
    }).then(function(data) {
      
      if(data != null)
      {
        return data.order_in_advance.toString();
      }
      else
      {
        log.error("Paramètre non trouvé");
        return 'ERROR';
      }

    });

  }

  public async updatePreOrder (req: Request,res: Response) : Promise<void> {
    log.info("Update Pre order");

    if ( req.body.order_in_advance == null ) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Pre order : Fail - Missing Fields");      
      }
    else if (typeof req.body.order_in_advance  != "boolean")
      {
            res.status(400).json({ error : "Boolean only" });
            res.end();
            log.error("Update Pre order : Fail - The value is not a boolean "); 
      }
      else
        {

        await Setting.update({ order_in_advance: req.body.order_in_advance }, {
          where: {
            id: 1
          }
        }).then(() => {
          res.status(200).end();
          log.info("Pre Order value update: New value is "+ req.body.order_in_advance);
        })
        .catch((error) => {
          res.status(500).end();
          log.error("Update Pre Order : Fail : " + error);  
        });
      
      }

  }

}
