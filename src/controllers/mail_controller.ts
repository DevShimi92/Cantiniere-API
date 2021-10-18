import { Request, Response } from "express";
import { log } from "../config/log_config";
import nodemailer from "nodemailer";
import crypto  from "crypto";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { RestToken } from "../models/rest_token";

let mailConfig ;

function randomValueHex (length:number) {
  return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0,length).toUpperCase();   // return required number of characters
}

if (process.env.NODE_MAIL_TEST_MODE == 'true'){
    mailConfig = {
      host: process.env.HOST_SMTP_URL_TEST,
      port: process.env.SMTP_PORT_TEST,
      secure: false,
      requireTLS: true,
      auth: {
          user: process.env.EMAIL_SUPPORT_TEST,
          pass: process.env.PASSWORD_SUPPORT_TEST
      }};
  }
else
  {
    mailConfig = {
      host: process.env.HOST_SMTP_URL,
      port: process.env.SMTP_PORT,
      secure: true,
      requireTLS: true,
      auth: {
          user: process.env.EMAIL_SUPPORT,
          pass: process.env.PASSWORD_SUPPORT
      }};
  }

const transporter = nodemailer.createTransport(mailConfig);

function sendMail ( mailOptions : object ) : void {

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      log.error(error);
      log.error(mailOptions);
    } else {
      log.info('Email sent : ')
      log.info(info);
    }
  });

}

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

      const promise = new Promise<boolean>((resolve, reject) => {  
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            log.error(error);
            log.error(mailOptions);
            return reject(false);
          } else {
            log.info('Email sent : ')
            log.info(info);
            return resolve(true);
          }
        });

      });
      
      promise.then(() => {
        res.status(200).end();
      });
  
      
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

            let rest_token : string;

            if (process.env.NODE_MAIL_TEST_MODE == 'true'){

              rest_token = jwt.sign("FAKETOKEN",process.env.SECRET_KEY_REST_TEST);

            }
            else {

              rest_token = jwt.sign({key_random : randomValueHex(40)},process.env.SECRET_KEY_REST, { expiresIn: 60 *15  });
              
            }
            

            await RestToken.findOne<RestToken>({
              attributes : ['id_client'],
              raw: true,
              where: {
                id_client: data.id
            }}).then(async function(dataClient) { 
              if(dataClient != null)
                {
                  await RestToken.destroy({
                    where: {
                      id_client: dataClient.id_client
                      }
                  });
                }
            });


            await RestToken.create<RestToken>({id_client: data.id, token_Rest: rest_token }).then(() => {

              var mailOptions = {
                from: process.env.EMAIL_SUPPORT,
                to: req.body.email,
                subject: 'Lien de réinitialisation de mot de passe',
                text: 'Voici un lien pour réinitialiser votre mot de passe :\n\n'+process.env.SITE_URL+"rest_password/"+rest_token + "\n\n Ce lien n'est valide que pendant 15 minute."
              };

              sendMail(mailOptions);
              res.status(200).end();
              

            });


          }

      });
    }

  }

  static async mailNewAccount (emailUser:string) : Promise<void>{

    var mailOptions = {
      from: process.env.EMAIL_SUPPORT,
      to: emailUser,
      subject: 'Bienvenue',
      text: "Bienevenue sur le site Cantiniere 2021 !\n\n"+'Nous espérons que vous passez un bon repas dans nos locaux!'
    };
  
    sendMail(mailOptions);
    log.info("mailNewAccount end");
    
                  
  }
  
  static async mailConfirmedOrder(emailUser:string): Promise<void>{

    var mailOptions = {
      from: process.env.EMAIL_SUPPORT,
      to: emailUser,
      subject: 'Confirmation de votre commande ',
      text: "Votre commande a bien été prise en compte !\n\n"+'Vous recevez un email losrsque votre commande sera prete !'
    };
  
    sendMail(mailOptions);
    log.info("mailConfirmedOrder end");
  

  }

  static async mailOrderReady(emailUser:string): Promise<void>{

    var mailOptions = {
      from: process.env.EMAIL_SUPPORT,
      to: emailUser,
      subject: 'Votre commande est prete a etre retirere',
      text: "Bonjour votre commande est prete a etre retirer !\n\n"+'Nous espérons que vous passez un bon repas dans nos locaux!'
    };
  
    sendMail(mailOptions);
    log.info("mailOrderReady end");
   
  }

  static async mailCancelOrder(emailUser:string): Promise<void>{

    var mailOptions = {
      from: process.env.EMAIL_SUPPORT,
      to: emailUser,
      subject: 'Votre commande a été annuler',
      text: "Votre commande a été annulé!\n\n"+'Nous espérons que vous passez un bon repas dans nos locaux!'
    };
  
    sendMail(mailOptions);
    log.info("mailCancelOrder end");


  }
}

