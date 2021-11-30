import { Request, Response } from "express";
import { log } from "../config/log_config";
import { TypeArticle } from "../models/type_article";

export class TypeArticleController {

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

  /**
   * @apiDefine TypeArticleFatalError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {post} /type_article Create type of article
   * @apiName PostTypeOfArticle
   * @apiGroup TypeArticle
   * @apiPermission admin
   * 
   * @apiBody {String} name Name of type of article
   * 
   * @apiSuccess (Success 204) NoContent Type of article created.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError AlreadyExist The type of article already exist.
   * 
   * @apiErrorExample 409-Error-Response :
   *     HTTP/1.1 409 Conflict
   * 
   * @apiUse TypeArticleFatalError
   */
  public async createTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Type of Article");

    if (req.body.name == null ) 
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Create Type of Article : Fail - Missing Fields");      
      }
    else
      {
        const articleFound = await TypeArticle.findAll<TypeArticle>({
              attributes : ['name'],
              raw: true,
              where: {
                name: req.body.name
              }
            }).then(function(data) { 
              return data;
            });
          
        if (articleFound.length > 0)
            {
              res.status(409).end();
              log.error("Create Type of Article : Fail - Article already exist");      
            }
        else
            {
              await TypeArticle.create<TypeArticle>({ name: req.body.name })
                .then(() => {
                  res.status(204).end();
                  log.info("Create Type of Article : OK");
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Type of Article : Fail - ERROR");
                  log.error(err);
                });
            }
      }
  }

  /**
   * @api {get} /type_article Get all type of article
   * @apiName GetTypeOfArticle
   * @apiGroup TypeArticle
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data List of Type of article (Array of Objects).
   * @apiSuccess {Number}   data.code_type     Code of Type of article.
   * @apiSuccess {String}   data.name          Name of Type of article. 
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     [
   *      { code_type: 1, name: 'Water' },
   *      { code_type: 2, name: 'Food' }
   *     ]
   * 
   */
  public async getAllTypeArticle(_req: Request,res: Response) : Promise<void> {
    log.info("Get all Type of Article");

    await TypeArticle.findAll<TypeArticle>({
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

      log.info("Get all Type of Article : OK");
    
    });

  }

  /**
   * @api {put} /type_article Update type of article
   * @apiName PutTypeOfArticle
   * @apiGroup TypeArticle
   * @apiPermission admin
   * 
   * @apiBody {String} name       Name of type of article
   * @apiBody {Number} code_type  Code of type of article
   * 
   * @apiSuccess (Success 204) NoContent Update of type of article done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly The value <code>code_type</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only for code_type"
   *     }
   * 
   * @apiError NotExist Type of Article not exist.
   * 
   * @apiErrorExample 404-Error-Response:
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse TypeArticleFatalError
   */
  public async updateTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Type of Article");

    if ( req.body.code_type == null || req.body.name == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update Type of Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.code_type))
      {
            res.status(400).json({ error : "Number only for code_type" }).end();
            log.error("Delete Type of Article : Fail - The value is not number"); 
      }
    else
    {
      const idSearch = await TypeArticle.findAll<TypeArticle>({
        attributes : ['code_type'],
        raw: true,
        where: {
          code_type: req.body.code_type
        }
          }).then(function(data) { 
        return data;
      });

      if (idSearch.length == 0)
        {
          res.status(404).end();
          log.error("Update Type of Article : Fail - Type of Article not exist");      
        }
      else
        {
            await TypeArticle.update({ name: req.body.name }, {
              where: {
                code_type: req.body.code_type
              }
            }).then(() => {
                  res.status(204).end();
                  log.info("Update Type of Article : OK");
                })
            .catch((err: Error,) => {
                res.status(500).end();
                log.error('Update Type of Article : Fail - ERROR');
                log.error(err);
                });
        
        }

    }

  }

  /**
   * @api {delete} /type_article Delete type of article
   * @apiName DeleteTypeOfArticle
   * @apiGroup TypeArticle
   * @apiPermission admin
   * 
   * @apiBody {Number} code_type  Code of type of article
   * 
   * @apiSuccess (Success 204) NoContent Type of article deleted.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly The value <code>code_type</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Type of Article not exist.
   * 
   * @apiErrorExample 404-Error-Response:
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse TypeArticleFatalError
   */
  public async deleteTypeArticle(req: Request,res: Response) : Promise<void> {
    log.info("Delete Type of Article");

    if ( req.body.code_type == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete Type of Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.code_type))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Delete Type of Article : Fail - The value is not number"); 
      }
    else
      {
        await TypeArticle.destroy<TypeArticle>({
          where: {
            code_type: req.body.code_type
          }
        }).then(function(dataTypeItem) {
          if(dataTypeItem == 0)
            {
              res.status(404).end();
              log.info("Delete Type of Article : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Type of Article : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete Type of Article : Fail - ERROR");
          log.error(err);
        });
      }
  }

}