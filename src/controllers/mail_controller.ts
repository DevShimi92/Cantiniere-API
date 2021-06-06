import { Request, Response } from "express";
import { log } from "../config/log_config";
import nodemailer from "nodemailer";
import crypto  from "crypto";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { RestToken } from "../models/rest_token";

function randomValueHex (length:number) {
  return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0,length).toUpperCase();   // return required number of characters
}

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

  public async forgotPasswordMail(req: Request, res: Response) : Promise<void>{

    if (req.body.email == null)
      {
            res.status(200).end();
            log.error("Missing email for forgot password operation");
      }
    else
    {
      await User.findOne<User>({
        attributes : ['id'],
        raw: true,
        where: {
          email: req.body.email
        }
      }).then(async function(data) {

        if(data == null)
          {
            res.status(200).end();
            log.error("Email not found for forgot password operation");
          }
        else
          {
            let rest_token = jwt.sign({key_random : randomValueHex(40)},process.env.SECRET_KEY_REST, { expiresIn: 60 *15  });

            await RestToken.findOne<RestToken>({
              attributes : ['id_client'],
              raw: true,
              where: {
                id_client: data.id
            }}).then(async function(data) { 
              if(data != null)
                {
                  await RestToken.destroy({
                    where: {
                      id_client: data.id_client
                      }
                  });
                }
            });


            await RestToken.create<RestToken>({id_client: data.id, token_Rest: rest_token }).then(() => {

              var mailOptions = {
                from: process.env.EMAIL_SUPPORT,
                to: process.env.EMAIL_SUPPORT,
                subject: 'Lien de réinitialisation de mot de passe',
                text: 'Voici un lien pour réinitialiser votre mot de passe :\n\n'+process.env.CLIENT_URL+"rest_password/"+rest_token + "\n\n Ce lien n'est valide que pendant 15 minute."
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  log.error(error);
                  log.error(mailOptions);
                } else {
                  log.info(" Email for rest password send to "+req.body.email);
                  log.info(info);
                }
              });

              res.status(200).end();

            });


          }

      });
    }

  }
}