import { Request, Response } from "express";
import { log } from "../config/log_config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.HOST_SMTP_URL,
  port: process.env.SMTP_PORT,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_SUPPORT,
    pass: process.env.PASSWORD_SUPPORT
  }
});

export class MailController {

  public report(req: Request, res: Response) : void {

    if (req.body.subject == null || req.body.message == null)
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Missing Fields for Submit a message for dev team");
      }
    else
    {
      let IdClient = '';

      if(!isNaN(req.body.id))
      { 
        log.info("Submit a message for dev team (Private Report)");
        IdClient = '[ ID Client : '+req.body.id+' ] ';
      }
      else
      {
        log.info("Submit a message for dev team (Public Report)");
      }

      var mailOptions = {
        from: process.env.EMAIL_SUPPORT,
        to: process.env.EMAIL_SUPPORT,
        subject: '[BUG] '+IdClient+req.body.subject,
        text: req.body.message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          log.error(error);
          log.error(mailOptions);
        } else {
          log.info('Email sent : ')
          log.info(info);
        }
      });
  
      res.status(200).end();
    }

  
  }

}