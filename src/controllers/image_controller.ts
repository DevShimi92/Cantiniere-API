import { Request, Response } from "express";
import * as fs from "fs";
import cloudinary  from "cloudinary" ;

import { log } from "../config/log_config";
import { Article } from "../models/article";
import { MenuInfo } from "../models/menu_info";


async function CheckIfExist(res: Response, id_article:number, id_menu:number) {

  if(id_article !=null)
    {

      await Article.findOne<Article>({
        raw: true,
        where: {
          id : id_article
        }
      }).then(function(data) { 

        if(data == null)
          {
            res.status(404).json({ error : "Article not found" }).end();
            log.error("Image Processing : Fail - Article not found"); 
            ImageController.deleteImage(res);
          }
        else
          {

            ImageController.imageProcessing(id_article,res,true).then(()=>{
              res.status(204).end();
                })
            .catch((error)=>{
              log.error(error);
              res.status(500).end();
            });

          }
      
      });

    }
  else
    {

        await MenuInfo.findOne<MenuInfo>({
          raw: true,
          where: {
            id : id_menu
          }
        }).then(function(data) { 

          if(data == null)
            {
              res.status(404).json({ error : "Menu not found" }).end();
              log.error("Image Processing : Fail - Menu not found"); 
              ImageController.deleteImage(res);
            }
          else
            {

              ImageController.imageProcessing(id_menu,res,false).then(()=>{
                res.status(204).end();
                
              })
              .catch((error)=>{
                log.error(error);
                res.status(500).end();
              });

            }
        
        });

    }

  
  
}

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

  public async beforeImageProcessing(req: Request, res: Response) : Promise<void> {
    log.info("Image Processing ...");

    if(req.body.id_article  == null && req.body.id_menu  == null)
      {
          res.status(400).json({ error : "Missing Fields" }).end();
          log.error("Image Processing : Fail - Missing Fields"); 
          ImageController.deleteImage(res);
      }
    else if( (isNaN(req.body.id_article) && req.body.id_article !=null) || (isNaN(req.body.id_menu) && req.body.id_menu !=null))
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

        CheckIfExist(res,req.body.id_article,req.body.id_menu);
       
      }
  }

  static async imageProcessing(id:number, res: Response, isArticle: boolean): Promise<boolean> {
    log.info("Image Processing ...");

    return new Promise<boolean>((resolve, reject) => { 

          cloudinary.v2.uploader.upload(res.locals.path,{ public_id: res.locals.fileName }, function(error, result) {
            log.debug(result);

            if(error)
              {
                log.error("Image Processing - Error during uploading : ");
                log.error(error);
                return reject(error);
              }
            else
              {

                if(isArticle)
                  {

                    return Article.update({ picture: result?.secure_url }, {
                      where: {
                        id: id
                      }
                    }).then(() => {

                        log.info("Image Processing : OK");
                        return resolve(true);

                      })
                    .catch((err: Error,) => {
                        log.error('Image Processing - Error with field picture of Article : ' + err);
                        ImageController.deleteImage(res);
                        return reject(err);
                      });

                  }
                else
                  {

                    return MenuInfo.update({ picture: result?.secure_url }, {
                      where: {
                        id: id
                      }
                    }).then(() => {

                        log.info("Image Processing : OK");
                        return resolve(true);

                      })
                    .catch((err: Error,) => {
                        log.error('Image Processing - Error with field picture of Article : ' + err);
                        ImageController.deleteImage(res);
                        return reject(err);
                      });

                  }

              }

        });

    });


  }


  static async deleteImage(res: Response): Promise<void> {
    fs.unlink(res.locals.path, function (err) {
      if (err) throw err;
      log.error('Image deleted!');
    });
  }

}

