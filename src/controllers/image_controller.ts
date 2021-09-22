import { Request, Response } from "express";
import * as fs from "fs";
import cloudinary  from "cloudinary" ;

import { log } from "../config/log_config";
import { Article } from "../models/article";

export class ImageController {

  public async getImage(req: Request, res: Response) : Promise<void> {
    log.info("Get image");

    if(req.body.id_article  == null)
      {
          res.status(400).json({ error : "Missing Fields" }).end();
          log.error("Get image : Fail - Missing Fields");
      }
    else if( (isNaN(req.body.id_article) && req.body.id_article !=null) )
      {
          res.status(400).json({ error : "Number only" }).end();
          log.error("Get image : Fail - The value is not number"); 
      }
    else
      {
        const dataImage = await Article.findOne<Article>({
          attributes : ['id','picture'],
          raw: true,
          where: {
            id: req.body.id_article
          }
            }).then(function(data) { 
       
              if (data == null)
                {
                  res.status(404).end();
                  log.error("Get image : Fail - Article not exist");   
                }
              else if (data.picture == null || data.picture == "" )
                {
                  res.status(404).end();
                  log.error("Get image : Fail - Image not exist");      
                } 
              else
                {
                  return data;
                }
        });

        if(dataImage){
          
          res.writeHead(301,{Location: dataImage.picture});
          res.end();
          log.info("Get image - Redirection Clear");

        }
  
      }

  }

  public async imageProcessing(req: Request, res: Response) : Promise<void> {
    log.info("Image Processing ...");

    if(req.body.id_article  == null)
      {
          res.status(400).json({ error : "Missing Fields" }).end();
          log.error("Image Processing : Fail - Missing Fields"); 
          ImageController.deleteImage(res);
      }
    else if( (isNaN(req.body.id_article) && req.body.id_article !=null) )
      {
          res.status(400).json({ error : "Number only" }).end();
          log.error("Image Processing : Fail - The value is not number"); 
          ImageController.deleteImage(res);
      }
    else if(req.files?.length == 0 || req.files?.length == undefined)
      {
        log.warn("Image Processing : Image not found");
        res.status(404).end();
      }
    else
      {
        
        await Article.findOne<Article>({
          raw: true,
        }).then(function(data) { 
    
          if(data == null)
            {
              res.status(404).json({ error : "Article not found" }).end();
              log.error("Image Processing : Fail - Article not found"); 
              ImageController.deleteImage(res);
            }
          else
            {
              cloudinary.v2.uploader.upload(res.locals.path,{ public_id: res.locals.fileName }, function(error, result) {
                  log.debug(result);

                  if(error)
                    {
                      log.error("Image Processing - Error during uploading : ");
                      log.error(error);
                      res.status(500).end();
                    }
                  else
                    {

                      Article.update({ picture: result?.secure_url }, {
                        where: {
                          id: req.body.id_article
                        }
                      }).then(() => {

                          res.status(204).end();
                          log.info("Image Processing : OK");

                        })
                      .catch((err: Error,) => {

                          res.status(500).end();
                          log.error('Image Processing - Error with field picture of Article : ' + err);
                          ImageController.deleteImage(res);

                        });

                    }

              });

            }
        
        });
        
       
      }
  }

  static async deleteImage(res: Response): Promise<void> {
    fs.unlink(res.locals.path, function (err) {
      if (err) throw err;
      log.error('Image deleted!');
    });
  }

}

