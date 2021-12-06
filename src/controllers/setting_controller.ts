import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Setting } from "../models/setting";
import { OrderInfo } from "../models/order_info";


export class SettingController {

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

  /**
   * @apiDefine SettingError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

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

  /**
   * @api {get} /setting/hour_limit Get Hour Limit
   * @apiName GetHourLimit 
   * @apiGroup Setting
   * 
   * @apiSuccess {String} hour_limit Hour limit.
   * 
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       hour_limit : "18:00:00"
   *     }
   */
  public async getHourLimit(_req: Request,res: Response) : Promise<void> {

    log.info("Get hour Limit route");
    let hour_limit = await SettingController.getHourLimit();
    res.status(200).json({ hour_limit : hour_limit }).end();

  }
  
  /**
   * @api {put} /setting/hour_limit Put Hour Limit
   * @apiName PutHourLimit 
   * @apiGroup Setting
   * @apiPermission admin
   * 
   * @apiBody {String} hour_limit  New hour limit.
   * 
   * @apiSuccess OK Hour limit update.
   * 
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * 
   * @apiError {String} MissingFields The fields <code>hour_limit</code> are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>hour_limit</code> is not formated.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Not formated"
   *     }
   * 
   * @apiUse SettingError
   * 
   */
  public async updateHourLimit(req: Request,res: Response) : Promise<void> {

    log.info("Update hour Limit");

    let exp = '^([0-1]?\\d:\\d\\d:\\d\\d)$|^(2[0-3]:\\d\\d:\\d\\d)$';
    let regexp = new RegExp (exp);
    
    if ( req.body.hour_limit == null ) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update hour Limit : Fail - Missing Fields");      
      }
    else if (!regexp.test(req.body.hour_limit) || req.body.hour_limit.length != 8)
      {
            res.status(400).json({ error : "Not formated" }).end();
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
    log.info("Check Total order limit of day");

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

  /**
   * @api {put} /setting/order_total_limit Put Total Order Limit Day
   * @apiName PutTotalOrderLimitDay
   * @apiGroup Setting
   * @apiPermission admin
   * 
   * @apiBody {String} nb_limit_per_day  New Total Order Limit Day.
   * 
   * @apiSuccess OK Total Order Limit Day update.
   * 
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * 
   * @apiError {String} MissingFields The fields <code>nb_limit_per_day</code> are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>nb_limit_per_day</code> is not a number.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse SettingError
   * 
   */
  public async updateTotalOrderLimitDay (req: Request,res: Response) : Promise<void> {
    log.info("Update Total order limit ");

    if ( req.body.nb_limit_per_day == null ) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update Total order limit : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.nb_limit_per_day))
      {
            res.status(400).json({ error : "Number only" }).end();
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

    return OrderInfo.count({
      where: {
        id_client: id_client
      }
    }).then(function(data){
      if(data != null)
      {
        if(data>OrderAccountLimit)
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

  /**
   * @api {put} /setting/order_total_limit_account Put Total Order Limit Account Per Day
   * @apiName PutTotalOrderLimitAccountPerDay
   * @apiGroup Setting
   * @apiPermission admin
   * 
   * @apiBody {String} nb_limit_per_account Total Order Limit Account Per Day.
   * 
   * @apiSuccess OK Total Order Limit Account Per Day update.
   * 
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * 
   * @apiError {String} MissingFields The fields <code>nb_limit_per_account</code> are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>nb_limit_per_account</code> is not a number.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse SettingError
   * 
   */
  public async updateTotalOrderLimitAccountPerDay (req: Request,res: Response) : Promise<void> {
    log.info("Update Total order limit per account");

    if ( req.body.nb_limit_per_account == null ) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update Total order limit per account : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.nb_limit_per_account))
      {
            res.status(400).json({ error : "Number only" }).end();
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
      
      if(PreOrderValue)
        {
          return true;
        }
      else if(!PreOrderValue && orderDate == undefined)
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

  /**
   * @api {put} /setting/pre_order Put Pre Order
   * @apiName PutPreOrder
   * @apiGroup Setting
   * @apiPermission admin
   * 
   * @apiBody {boolean} order_in_advance Pre Order enable or disable.
   * 
   * @apiSuccess OK Status Pre Order update.
   * 
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * 
   * @apiError {String} MissingFields The fields <code>order_in_advance</code> are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly	The value <code>order_in_advance</code> is not a boolean.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Boolean only"
   *     }
   * 
   * @apiUse SettingError
   * 
   */
  public async updatePreOrder (req: Request,res: Response) : Promise<void> {
    log.info("Update Pre order");

    if ( req.body.order_in_advance == null ) 
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update Pre order : Fail - Missing Fields");      
      }
    else if (typeof req.body.order_in_advance  != "boolean")
      {
            res.status(400).json({ error : "Boolean only" }).end();
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

  /**
   * @api {get} /setting/ Get All Setting
   * @apiName GetAllSetting
   * @apiGroup Setting
   * @apiPermission admin

   * @apiSuccess {Object}   data                             Current setting (Objects of string).
   * @apiSuccess {String}   data.hourlimit                   Hour limit.
   * @apiSuccess {String}   data.totalOrderLimitDay          Limit of order per day.
   * @apiSuccess {String}   data.totalOrderLimitAccountDay   Total of order limit per account per day.
   * @apiSuccess {String}   data.canPreOrder                 Current status of Pre Order.
   * 
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     { 
   *         hourlimit : "18:00:00",
   *         totalOrderLimitDay :"15",
   *         totalOrderLimitAccountDay:"2",
   *         canPreOrder:"true"
   *      }
   */
  public async getAllSetting (_req: Request,res: Response) : Promise<void> {
    log.info("Get all setting ");

    let hourlimit = await SettingController.getHourLimit();

    let totalOrderLimitDay = await SettingController.getTotalOrderLimitDay();

    let totalOrderLimitAccountDay = await SettingController.getTotalOrderLimitAccountDay();

    let canPreOrder = await SettingController.getPreOrder();

    let data = {
      hourlimit : hourlimit,
      totalOrderLimitDay : totalOrderLimitDay,
      totalOrderLimitAccountDay : totalOrderLimitAccountDay,
      canPreOrder : canPreOrder,
    }

    res.status(200).json(data).end();

  }
}
