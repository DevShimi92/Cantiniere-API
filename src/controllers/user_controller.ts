import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto  from "crypto";
import bcrypt from "bcrypt";

import { log } from "../config/log_config";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh_token";
import { RestToken } from "../models/rest_token";
import { MailController } from './mail_controller';
import { SettingController } from './setting_controller';


let errorUpdate : boolean = false;
let UpdateOk : number = 0;

let SECRET_KEY : string;

if(process.env.NODE_MAIL_TEST_MODE == 'true')
      SECRET_KEY=process.env.SECRET_KEY_REST_TEST;
  else
      SECRET_KEY=process.env.SECRET_KEY_REST;

async function compareAndUpdate(id:number, ColToChange:string,value:string='', money:number=0, cooker:boolean=false):Promise<void>{
   
  if((money != 0) && (!isNaN(money)) && (cooker))
      {
        await User.update({ [ColToChange] : money }, {
          where: {
            id: id
          }
        }).then(() => {
          UpdateOk++;
        })
        .catch((err: Error,) => {
          log.error('Error with field of User : ' + err);
          errorUpdate=true;
            });
      }
    else if(value != '' )
      {
        await User.update({ [ColToChange] : value }, {
          where: {
            id: id
          }
        }).then(() => {
          UpdateOk++;
        })
        .catch((err: Error,) => {
          log.error('Error with field of User : ' + err);
          errorUpdate=true;
            });
      }

}

async function updatePassword(id:number,password:string):Promise<void>{

  if(password != null && !securePasswordCheck(password))
      {

      let salt =  await User.findOne<User>({
          attributes : ['salt'],
          raw: true,
          where: {
            id: id
          }
        }).then(function(dataUser) {
          if(dataUser != null)
            {
              return dataUser.salt.toString();
            }
            else
            {
              log.error("SALT non trouvé");
              return 'ERROR';
            }
        });

        let hash =  await bcrypt.hash(password, salt);
        
        await User.update({ password: hash }, {
            where: {
              id: id
            }
          }).then(() => {
            UpdateOk++;
          })
          .catch((errUpdate: Error) => {
              log.error('Error with field password  : ' + errUpdate);
              errorUpdate=true;
            });

        }

}

async function checkDataUserAndProcess(res: Response, tokenRestPassword:string, password:string) {


  let id_client = await RestToken.findOne<RestToken>({
    attributes : ['id_client','token_Rest'],
    raw: true,
    where: {
      token_Rest: tokenRestPassword
    }}).then(async function(data) { 
      return data?.id_client;
    });

  if(id_client)
  {

        await updatePassword(id_client,password);

        if(!errorUpdate)
          {

            await RestToken.destroy({
              where: {
                token_Rest: tokenRestPassword
                }
            }).then(() => {
              log.info('Rest Token delete');
            });

            res.status(200).end();
            log.info('Rest Password success for account n° '+id_client);
            UpdateOk=0;
          }
        else
          {
            res.status(500).end();
            UpdateOk=0;
            errorUpdate=false;
          }

      }
    else
      {
        log.warn("Token not found in BDD");
        res.status(401).end();
  }
  
}

function randomValueHex (length:number) {
  return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex') // convert to hexadecimal format
      .slice(0,length).toUpperCase();   // return required number of characters
}

function securePasswordCheck (password:string):boolean {

  let exp = RegExp("^(?=(.*[a-z]))(?=(.*[A-Z]))(?=(.*[\\d]))(?=(.*[!@#$%^&*()\-__+.])+).{8,}$");
  let regexp = new RegExp (exp);

  if(!regexp.test(password))
    {
      log.error('Password not secure !');
      return true
    }
  else
    return false
}

export class UserController {

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

  /**
   * @apiDefine UserFatalError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {post} /user Create User
   * @apiName PostUser
   * @apiGroup User
   * 
   * @apiBody {String} last_name  Last name of user.
   * @apiBody {String} first_name First name of user.
   * @apiBody {String} email      Email of user.
   * @apiBody {String} password   Password of user.
   * 
   * @apiSuccess (Success 201) {String} token Token of User.
   * @apiSuccess (Success 201) {String} refresh_token Refresh token of User.
   * 
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       token : "TheToken",
   *       refresh_token : "TheRefreshToken" 
   *     }
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   *
   * @apiError {String} PasswordNotSecure The password is not secure (Need a password with a length of 8 characters minimum which contains an upper case, a lower case, a number and a special character).
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Password not secure"
   *     }
   * 
   * @apiError AlreadyExist User already exist.
   * 
   * @apiErrorExample 409-Error-Response :
   *     HTTP/1.1 409 Conflict
   * 
   * @apiUse UserFatalError
   */
  public async createUser(req: Request, res: Response) : Promise<void> {

    log.info("Create User");

    if (req.body.last_name == null || req.body.first_name == null || req.body.email == null || req.body.password == null )
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Create User : Fail - Missing Fields");      
      }
    else if(securePasswordCheck(req.body.password))
      {
            res.status(400).json({ error : 'Password not secure' }).end();
            log.error("Create User : Fail - Password not secure");     
      }
    else
      {
        const emailFound = await User.findAll<User>({
              attributes : ['email'],
              raw: true,
              where: {
                email: req.body.email
              }
            }).then(function(data) { 
              return data;
            });
          
        if (emailFound.length > 0)
            {
              res.status(409).end();
              log.error("Create User : Fail - Account already exist");      
            }
        else
            {

              let saltRounds = 10 ;

              let salt =  await bcrypt.genSalt(saltRounds);

              let hash =  await bcrypt.hash(req.body.password, salt);

              let newdata = await User.create<User>({ 
                  last_name: req.body.last_name,
                  first_name: req.body.first_name,
                  password: hash,
                  salt : salt,
                  email: req.body.email, })
                .then((result) => {
                
                    return result.get({ plain: true });
                
                }).catch((err: Error) => {
                
                  res.status(500).end();
                  log.error("Create User : Fail - ERROR Can't create User");
                  log.error(err);
                
                });
              log.error(newdata);
              if(newdata)
              { 

                  let hour_limit = await SettingController.getHourLimit();
                  
                  let dataSendInToken = {
                        id: newdata.id,
                        last_name: newdata.last_name,
                        first_name: newdata.first_name,
                        email: newdata.email,
                        money: newdata.money,
                        cooker: false,
                        hour_limit: hour_limit
                  }

                  let token = jwt.sign(dataSendInToken,process.env.SECRET_KEY,{ expiresIn: 60 * 15 });

                  let refresh_token = jwt.sign({key_random : randomValueHex(40)},process.env.SECRET_KEY_REFRESH);

                  await RefreshToken.create<RefreshToken>({id_client: newdata.id, tokenRefresh: refresh_token }).then(async () => {
                  
                    await MailController.mailNewAccount(req.body.email);
                    // res.setHeader('Set-Cookie', cookie.serialize('refresh_token', refresh_token, { httpOnly: true }))
                    res.status(201).json({
                      token: token,
                      refresh_token: refresh_token
                      }).end();

                      log.info("Create User : OK");

                      

                    }).catch((err: Error) => {
                      res.status(500).end();
                      log.error("Create User : Fail - ERROR");
                      log.error(err);
                    });

              }

            }

      }
    
  }

  /**
   * @api {get} /user Get all User
   * @apiName GetAllUser
   * @apiGroup User
   * @apiPermission admin 
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data                  List of User (Array of Objects).
   * @apiSuccess {Number}   data.id               ID of User.
   * @apiSuccess {String}   data.first_name       First name  of User.    
   * @apiSuccess {String}   data.last_name        Last name of User.   
   * @apiSuccess {Number}   data.money            Money of User.  
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     [{ 
   *            "id": 1, 
   *            "first_name": 'Louis', 
   *            "last_name": 'PASTATA', 
   *            "money": 200, 
   *      },
   *      { 
   *            "id": 2, 
   *            "first_name": 'Claire', 
   *            "last_name": 'MAMAISON', 
   *            "money": 100, 
   *      }]
   * 
   */
  public async getAllUser(_req: Request,res: Response) : Promise<void> {
    log.info("Get all User");
 
          await User.findAll<User>({
            attributes : ['id','first_name','last_name','money'],
            where: {
              cooker: false
            },
            order:  [
              ['money', 'DESC']
            ],
            raw: true,
          }).then(function(data) { 
      
            if(data.length == 0)
              {
                res.status(204).end();
              }
            else
              {
                res.status(200).json(data).end();
              }
      
            log.info("Get all User : OK");
          
          });
  }

  /**
   * @api {put} /user Put User 
   * @apiName PutUser
   * @apiGroup User
   *  
   * @apiBody {Number} id            ID of User.
   * @apiBody {String} [first_name]  First name of user.
   * @apiBody {Number} [last_name]   Last name of user.
   * @apiBody {String} [email]       Email of user.
   * @apiBody {String} [password]    Password of user.
   * @apiBody {String} [money]       Money of user. **Need admin access for update this**.
   *  
   * @apiSuccess (Success 204) NoContent Update of user done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {string} MissingFields The value <code>id</code> is missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {string} NumberOnly The value <code>id</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist User not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   *    { 
   *      "error" : "Account not exist"
   *    }
   * 
   * @apiError Conflict Some Fields can't update.
   * 
   * @apiErrorExample 409-Error-Response :
   *     HTTP/1.1 409 Conflict
   *
   */
  public async updateUser(req: Request, res: Response) : Promise<void> {
    log.info("Update User");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update User : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Update User : Fail - The value is not number"); 
      }
    else
    {
      const idSearch = await User.findAll<User>({
        attributes : ['id'],
        raw: true,
        where: {
          id: req.body.id
        }
          }).then(function(data) { 
        return data;
      });

      if (idSearch.length == 0)
        {
          res.status(404).json({ error : 'Account not exist' }).end();
          log.error("Update User : Fail - Account not exist");      
        }
      else
        {
          const NameOfCol: string[] = ['first_name', 'last_name', 'email', 'money', 'password'];

          await compareAndUpdate(req.body.id,NameOfCol[0],req.body.first_name);
          await compareAndUpdate(req.body.id,NameOfCol[1],req.body.last_name);
          await compareAndUpdate(req.body.id,NameOfCol[2],req.body.email);
          await compareAndUpdate(req.body.id,NameOfCol[3],undefined,req.body.money,res.locals.cooker);
          await updatePassword(req.body.id,req.body.password);


          if(!errorUpdate)
            {
              res.status(204).end();
              log.info("Update User : OK");
              UpdateOk=0;
            }
          else
            {
              res.status(409).end();
              log.warn("Update User : OK with error - "+UpdateOk+' update done only');
              UpdateOk=0;
              errorUpdate=false;
            }

        }

    }

  }

  /**
   * @api {delete} /user Delete User 
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission admin
   *  
   * @apiBody {Number} id                ID of user.
   * 
   * @apiSuccess (Success 204) NoContent User deleted.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {string} MissingFields The value <code>id</code> is missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {string} NumberOnly The value <code>id</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist User not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse UserFatalError
   * 
   */
  public async deleteUser(req: Request,res: Response) : Promise<void> {
    log.info("Delete User");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete User : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Delete User : Fail - The value is not number"); 
      }
    else 
      {
        await User.destroy<User>({
          where: {
            id: req.body.id
          }
        }).then(function(dataUser) { 
          if(dataUser == 0)
            {
              res.status(404).end();
              log.info("Delete User : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete User : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete User : Fail - ERROR");
          log.error(err);
        });
      }
  }

  /**
   * @api {post} /rest_password Rest password
   * @apiName RestPassword
   * @apiGroup User
   *  
   * @apiBody {String} password    New password of user.
   * 
   * @apiSuccess (Success 200) OK User update done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 200 OK
   * 
   * @apiError {string} MissingFields The value <code>password</code> is missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Password"
   *     }
   * 
   * @apiError Unauthorized Token not valid, expired or not found
   * 
   * @apiErrorExample 401-Error-Response :
   *     HTTP/1.1 401 Unauthorized
   * 
   * @apiUse UserFatalError
   */
  public async restPassword(req: Request,res: Response) : Promise<void> {
    log.info("Rest Password");

    if (req.body.password == null )
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Missing Password");      
      }
    else
    {
      
      let tokenRestPassword = req.headers.authorization;

      if (!!tokenRestPassword && tokenRestPassword.startsWith('Bearer ')) {
          tokenRestPassword = tokenRestPassword.slice(7, tokenRestPassword.length);
        }
      
      if(tokenRestPassword !== undefined)
        {

                
          jwt.verify(tokenRestPassword, SECRET_KEY, async (err) => {
            if (err) {
              log.warn("Token not valid or expired");
              res.status(401).end();
              } 
            else 
              {
                  checkDataUserAndProcess(res,tokenRestPassword!,req.body.password);
              }
            });
        }
      else
        {
          log.warn("Token not found");
          res.status(401).end();
        }

    }

  }

}