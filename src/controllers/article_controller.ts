import { Request, Response } from "express";
import { log } from "../config/log_config";
import { Article } from "../models/article";
import { ImageController } from "./image_controller";

let errorUpdate : boolean = false;
let UpdateOk : number = 0;

async function compareAndUpdate(id:number, value:string, ColToChange:string) {

    if(value != null)
      {
        await Article.update({ [ColToChange] : value }, {
          where: {
            id: id
          }
        }).then(() => {
          UpdateOk++;
        })
        .catch((err: Error,) => {
          log.error('Error with field of Article : ' + err);
          errorUpdate=true;
            });
      }

}

export class ArticleController {

  /**
   * @apiDefine admin Canteen manager only
   * Need an account with the Canteen manager access 
   */

  /**
   * @apiDefine ArticleFatalError
   *
   * @apiError (500 Internal Server Error) InternalServerError The server encountered an unexpected error.
   * 
   * @apiErrorExample 500-Error-Response :
   *     HTTP/1.1 500 Internal Server Error
   */

  /**
   * @api {post} /article Create article
   * @apiName PostArticle
   * @apiGroup Article
   * @apiDescription Warning : This request must be send in **content-type**.
   * @apiPermission admin
   * 
   * @apiBody {String} name            Name of article.
   * @apiBody {Number} price           Price of article.
   * @apiBody {Number} code_type_src   Code type used for this article.
   * @apiBody {String} [description]   Description  of article.
   * @apiBody {File}   [img]           Image of article.
   * 
   * @apiSuccess (Success 201) Created Article created.
   * 
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   * 
   * @apiError {String} MissingFields Some fields are missing.
   * 
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly The value <code>code_type_src</code> or <code>price</code> is not number.
   *   
   * @apiErrorExample {json} 400-Error-Response:
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiUse ArticleFatalError
   */
  public async createArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Article");
    if (req.body.name == null || req.body.price == null || req.body.code_type_src == null)
      {
            res.status(400).json({ error : 'Missing Fields' }).end();
            log.error("Create Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.code_type_src) || isNaN(req.body.price))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Create Article : Fail - The value is not number"); 
      }
    else
      {
        if(req.body.description === 'null')
            {
              req.body.description = null;
            }
            
          await Article.create<Article>({ name: req.body.name, price : req.body.price, code_type_src: req.body.code_type_src, description: req.body.description})
              .then(async (data) => {

                  if(req.files?.length == 0 || req.files?.length == undefined)
                    {
                      log.warn("Create Article : Image not found.");
                      res.status(201).end();
                      log.info("Create Article : OK");
                    }
                  else
                    {
                      log.info("Create Article : Image found. Upload image");
                      await ImageController.imageProcessing(data.id,res,true);
                      res.status(201).end();
                      log.info("Create Article : OK");
                    }

              })
              .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Article : Fail - ERROR");
                  log.error(err);
              });

                
      }
    
  }
  
  /**
   * @api {get} /article Get all article
   * @apiName GetArticle
   * @apiGroup Article
   * 
   * @apiSuccess (Success 204) NoContent Reponse empty because data is not found in base.
   * 
   * @apiSuccessExample Success-Response-Empty :
   *     HTTP/1.1 204 No Content
   * 
   * @apiSuccess {Object[]} data                  List of article (Array of Objects).
   * @apiSuccess {Number}   data.id               ID of article.
   * @apiSuccess {String}   data.name             Name of article.    
   * @apiSuccess {Number}   data.code_type_src    Code type used for this article.   
   * @apiSuccess {Number}   data.price            Price of article.   
   * @apiSuccess {String}   [data.picture]        Picture of article.  
   * @apiSuccess {String}   [data.description]    Description of article.
   * 
   * @apiSuccessExample Success-Response-with data (example) :
   *     HTTP/1.1 200 OK
   *     [
   *        { "id" : 1 ,"name": 'Coca-cola', "code_type_src" : 1, "price": 1.5, "picture" : null , "description": null},
   *        { "id" : 2 ,"name": 'Baguette', "code_type_src" : 2, "price": 1, "picture" : "https://urlToPictureOFaPain.com/image/baguette.jpeg" , "description": "Ceci est une baguette / This is a baguette"}
   *     ]
   * 
   */
  public async getAllArticle(_req: Request,res: Response) : Promise<void> {
    log.info("Get all article");

    await Article.findAll<Article>({
      attributes : ['id','name','code_type_src','price','picture','description'],
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

      log.info("Get all article : OK");
    
    });

  }

  /**
   * @api {put} /article Update article
   * @apiName PutArticle
   * @apiGroup Article
   * @apiPermission admin
   *  
   * @apiBody {Number} id                ID of article.
   * @apiBody {String} [name]            Name of article.
   * @apiBody {Number} [price]           Price of article.
   * @apiBody {Number} [code_type_src]   Code type used for this article.
   * @apiBody {String} [description]     Description of article.
   * @apiBody {String} [img]             Url of Image of article.
   * 
   * @apiSuccess (Success 204) NoContent Update of article done.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {string} The value <code>id</code> is missing.
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
   * @apiError NotExist Article not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiError Conflict Some Fields can't update.
   * 
   * @apiErrorExample 409-Error-Response :
   *     HTTP/1.1 409 Conflict
   *
   */
  public async updateArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Article");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Update Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Update Article  : Fail - The value is not number"); 
      }
    else
    {
      const idSearch = await Article.findAll<Article>({
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
          res.status(404).end();
          log.error("Update Article : Fail - Article not exist");      
        }
      else
      {
        const NameOfCol: string[] = ['name', 'code_type_src', 'price', 'picture', 'description'];

        await compareAndUpdate(req.body.id,req.body.name,NameOfCol[0]);
        await compareAndUpdate(req.body.id,req.body.code_type_src,NameOfCol[1]);
        await compareAndUpdate(req.body.id,req.body.price,NameOfCol[2]);
        await compareAndUpdate(req.body.id,req.body.picture,NameOfCol[3]);
        await compareAndUpdate(req.body.id,req.body.description,NameOfCol[4]);

        if(!errorUpdate)
          {
            res.status(204).end();
            log.info("Update Article : OK");
            UpdateOk=0;
          }
        else
          {
            res.status(409).end();
            log.warn("Update Article : OK with error - "+UpdateOk+' update done only');
            UpdateOk=0;
            errorUpdate=false;
          }

      }

    }

  }

  /**
   * @api {delete} /article Delete article
   * @apiName DeleteArticle
   * @apiGroup Article
   * @apiPermission admin
   * 
   * @apiBody {Number} id  ID of article
   * 
   * @apiSuccess (Success 204) NoContent Article deleted.
   * 
   * @apiSuccessExample Success-Response :
   *     HTTP/1.1 204 No Content
   * 
   * @apiError {String} MissingFields The value <code>id</code> is missing.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Missing Fields"
   *     }
   * 
   * @apiError {String} NumberOnly The value <code>id</code> is not number.
   * 
   * @apiErrorExample {json} 400-Error-Response :
   *     HTTP/1.1 400 Bad Request
   *     {
   *       "error": "Number only"
   *     }
   * 
   * @apiError NotExist Article not exist.
   * 
   * @apiErrorExample 404-Error-Response :
   *     HTTP/1.1 404 Not Found
   * 
   * @apiUse ArticleFatalError
   */
  public async deleteArticle(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" }).end();
            log.error("Delete Article : Fail - Missing Fields");      
      }
    else if (isNaN(req.body.id))
      {
            res.status(400).json({ error : "Number only" }).end();
            log.error("Delete Article : Fail - The value is not number"); 
      }
    else
      {
        await Article.destroy<Article>({
          where: {
            id: req.body.id
          }
        }).then(function(dataArticle) { 
          if(dataArticle == 0)
            {
              res.status(404).end();
              log.info("Delete Article : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Article : OK");
          }
            
        }).catch((err: Error) => {
          res.status(500).end();
          log.error("Delete Article : Fail - ERROR");
          log.error(err);
        });
      }
  }

  
}