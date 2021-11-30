import { Request, Response } from "express";
import crypto  from "crypto";
import { log } from "../config/log_config";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh_token";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


function randomValueHex (length:number) {
  return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0,length).toUpperCase();   // return required number of characters
}

async function refreshTokenRest(dataUser:any,refresh_token:string) {

  await RefreshToken.findOne({ where: { id_client: dataUser.id } }).then(async (dataRefreshToken) => {
                  
    if(dataRefreshToken != null)
    {
      await RefreshToken.destroy({
        where: {
          id_client: dataUser.id,
          tokenRefresh: dataRefreshToken.tokenRefresh
          }
      });
    }
    
    await RefreshToken.create<RefreshToken>({id_client: dataUser.id, tokenRefresh: refresh_token }).then(() => {
          //Nothing
      }).catch((errRefreshToken: Error) => {
        log.error("Connection to api : Fail - ERROR");
        log.error(errRefreshToken);
      });


  });
  
}

export class AuthController {
  /**
   * @apiDefine AuthFatalError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response:
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {post} /login Login
   * @apiName Login
   * @apiGroup Authentication
   *
   * @apiBody {String} email       Email of account.
   * @apiBody {String} password    Password of account.
   * 
   * @apiSuccess (Success 200) OK Successful identification.
   * 
   * @apiSuccessExample {json} Success-Response-with data (example):
   *     HTTP/1.1 200 OK
   *     {
   *       "token": "THEtOKEn",
   *       "refresh_token": "TheReFResHTokEN"
   *     }
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} Unauthorized  Account not found or Failed identification.
   * 
   * @apiErrorExample {json} 401-Error-Response :
   *     HTTP/1.1 401 Unauthorized
   * 
   */
  public async login(req: Request, res: Response) : Promise<void> {
    log.info("Connection attempt to api");

    if (req.body.email == null || req.body.password == null)
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Connection to api : Fail - Missing Fields");
      }
    else
      {

        await User.findOne<User>({
          attributes : ['id','last_name','first_name','email','money','password','salt','cooker'],
          raw: true,
          where: {
            email: req.body.email
          }
        }).then(async function(data) { 
      
          if(data == null)
            {
              log.error("Connection to api : Fail - Account not found");
              res.status(401).end();
            }
          else
            {

              bcrypt.compare(req.body.password, data.password, async function(err, result) {

                if (err || !result ) { 
                  log.error("Connection to api : Fail - Failed identification");
                  log.error('Result : '+result); 
                  log.error('Erreur : '); 
                  log.error(err); 
                  res.status(401).end();
                 }
                else
                  {
                  let dataUser = { 
                    id : data.id, 
                    last_name : data.last_name,
                    first_name: data.first_name,
                    email: data.email,
                    money: data.money,
                    cooker: data.cooker
                  };
                
                  let token = jwt.sign(dataUser,process.env.SECRET_KEY,{ expiresIn: 60 * 15 });
          
                  let refresh_token = jwt.sign({key_random : randomValueHex(40)},process.env.SECRET_KEY_REFRESH);
                  
                  await refreshTokenRest(dataUser,refresh_token);

                  // res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refresh_token, { httpOnly: true }))
                  res.status(200).json({
                        token: token,
                        refresh_token: refresh_token
                        }).end();

                  log.info("API connection successful for : " + dataUser.last_name);
                  
                }
              });
            }
    
        
        });

      }

  }

  public loginTest(_req: Request, res: Response) : void {
    console.log("HELL YUEAH");
    res.status(200).json({
      hell: 'yeah'
   }).end();
  }

  /**
   * @api {post} /refresh_token Refresh Token
   * @apiName RefreshToken
   * @apiGroup Authentication
   *
   * @apiBody {String} id              ID of account.
   * @apiBody {String} refreshToken    Refresh token of account.
   * 
   * @apiSuccess (Success 200) OK Successful identification.
   * 
   * @apiSuccessExample {json} Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     {
   *       "token": "THEtOKEn",
   *       "refresh_token": "TheReFResHTokEN"
   *     }
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} Forbidden  Token not found. 
   * 
   * @apiErrorExample {json} 403-Error-Response :
   *     HTTP/1.1 403 Forbidden
   * 
   * @apiUse AuthFatalError
   * 
   */
  public async refreshToken(req: Request, res: Response) : Promise<void> {
    log.info("Refresh token request ...");

    if (req.body.refreshToken == null || req.body.id == null )
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Refresh token : Fail - Missing Fields");
      }
    else
      {
        await RefreshToken.findAll<RefreshToken>({
          where: {
          id_client: req.body.id,
          tokenRefresh: req.body.refreshToken
          },
        }).then(async function(data) {
          
          if(data.length == 0)
            {
              res.status(403).end();
              log.error("Refresh token : Fail - NOT FOUND");
            }
          else
            {
              let refresh_token = jwt.sign({key_random : randomValueHex(40)},process.env.SECRET_KEY_REFRESH);

              await RefreshToken.update<RefreshToken>({tokenRefresh: refresh_token}, {
                  where: {
                     id_client: req.body.id,
                  }}).then(async () => {

                    await User.findOne<User>({
                      attributes : ['id','last_name','first_name','email','money','password','cooker'],
                      raw: true,
                      where: {
                        id: req.body.id
                      }
                    }).then(async function(dataClient) { 
                      if(dataClient != null)
                        { 
                          let dataUser = { 
                            id : dataClient.id, 
                            last_name : dataClient.last_name,
                            first_name: dataClient.first_name,
                            email: dataClient.email,
                            money: dataClient.money,
                            cooker: dataClient.cooker
                          };

                          let token = jwt.sign(dataUser,process.env.SECRET_KEY, { expiresIn: 60 *15  });

                          // res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refresh_token, { httpOnly: true }))
                            res.status(200).json({
                              token : token,
                              refresh_token: refresh_token
                              }).end();
                              log.info("Refresh token successful for user n° " + req.body.id);
                        }

                    }).catch((err: Error) => {
                      res.status(500).end();
                      log.error("Refresh token : Fail - ERROR with user ");
                      log.error(err);
                    });

               }).catch((err: Error) => {
                 res.status(500).end();
                 log.error("Refresh token : Fail - ERROR with tokenRefresh ");
                 log.error(err);
               });

            }

        });
      }
  }

}