import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Setting } from "../models/setting";

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

}