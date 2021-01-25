import { Request, Response } from "express";
import { log } from "../config/log_config";
import { User } from "../models/user";
import { TypeArticle } from "../models/type_article";
import { Article } from "../models/article";
import { MenuInfo } from "../models/menu_info";
import { MenuContent } from "../models/menu_content";
import { OrderInfo } from "../models/order_info";

export class Controller {

  public index(req: Request, res: Response) : void {
    log.info("Ping on api");
    res.status(200).json({
       message: "Cantiniere-API"
    });
  }

  public async createUser(req: Request, res: Response) : Promise<void> {
    log.info("Create User");

    if (req.body.last_name == null || req.body.first_name == null || req.body.password == null || req.body.email == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create User : Fail - Missing Fields");      
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
              res.status(409);
              res.end();
              log.error("Create User : Fail - Account already exist");      
            }
        else
            {
              await User.create<User>({ last_name: req.body.last_name,
                  first_name: req.body.first_name,
                  password: req.body.password,
                  email: req.body.email, })
                .then(() => {
                  res.status(201).end();
                  log.info("Create User : OK");
                }).catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create User : Fail - ERROR");
                  log.error(err);
                });

            }

      }
    
  }
  
  public async getAllUser(req: Request,res: Response) : Promise<void> {
    log.info("Get all User");

    await User.findAll<User>({
      attributes : ['id','first_name','last_name','money'],
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

  public async updateUser(req: Request, res: Response) : Promise<void> {
    log.info("Update User");

    if ( req.body.id == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update User : Fail - Missing Fields");      
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
          res.status(404).json({ error : 'Account not exist' });
          res.end();
          log.error("Update User : Fail - Account not exist");      
        }
      else
        {
          let Number_of_OK = 0;
          let Number_ofError = 0;

          if(req.body.first_name != null)
          {
            await User.update({ first_name: req.body.first_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => Number_of_OK++)
            .catch((err: Error,) => {
              Number_ofError++;
              log.error('Error with field first_name of user : ' + err);
                });
            }

          if(req.body.last_name != null)
          {
            await User.update({ last_name: req.body.last_name }, {
              where: {
                id: req.body.id
              }
            }).then(() => Number_of_OK++)
            .catch((err: Error,) => {
              Number_ofError++;
              log.error('Error with field last_name of user : ' + err);
                });
          }

          if(req.body.email != null)
          {
            await User.update({ email: req.body.email }, {
              where: {
                id: req.body.id
              }
            }).then(() => Number_of_OK++)
            .catch((err: Error,) => {
              Number_ofError++;
              log.error('Error with field email of user : ' + err);
                });
          }

          if(req.body.password != null)
          {
            await User.update({ password: req.body.password }, {
              where: {
                id: req.body.id
              }
            }).then(() => Number_of_OK++)
            .catch((err: Error,) => {
              Number_ofError++;
              log.error('Error with field password of user : ' + err);
                });
          }

          if(Number_ofError == 0)
            {
              res.status(204).end();
              log.info("Update User : OK");
            }
          else
            {
              res.status(409).end();
              log.warn("Update User : OK with error - "+Number_of_OK+' update done only');
            }

        }

    }

  }

  public async deleteUser(req: Request,res: Response) : Promise<void> {
    log.info("Delete User");

    if ( req.body.id == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete User : Fail - Missing Fields");      
      }
    else
      {
        await User.destroy<User>({
          where: {
            id: req.body.id
          }
        }).then(function(data) { 
          if(data == 0)
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

  public async createTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Type of Article");

    if (req.body.name == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
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
              res.status(409);
              res.end();
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

  public async getAllTypeArticle(req: Request,res: Response) : Promise<void> {
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

  public async updateTypeArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Type of Article");

    if ( req.body.code_type == null || req.body.name == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Type of Article : Fail - Missing Fields");      
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
          res.status(404).json();
          res.end();
          log.error("Update Type of Article : Fail - Type of Article not exist");      
        }
      else
        {
            await TypeArticle.update({ name: req.body.name }, {
              where: {
                code_type: req.body.code_type
              }
            }).then(() => {
                  res.status(204);
                  res.end();
                  log.info("Update Type of Article : OK");
                })
            .catch((err: Error,) => {
                res.status(500);
                res.end();
                log.error('Update Type of Article : Fail - ERROR');
                log.error(err);
                });
        
        }

    }

  }

  public async deleteTypeArticle(req: Request,res: Response) : Promise<void> {
    log.info("Delete Type of Article");

    if ( req.body.code_type == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Type of Article : Fail - Missing Fields");      
      }
    else
      {
        await TypeArticle.destroy<TypeArticle>({
          where: {
            code_type: req.body.code_type
          }
        }).then(function(dataType) { 
          if(dataType == 0)
            {
              res.status(404).end();
              log.info("Delete Type of Article : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Type of Article : OK");
          }
            
        }).catch((errType: Error) => {
          res.status(500).end();
          log.error("Delete Type of Article : Fail - ERROR");
          log.error(errType);
        });
      }
  }

  public async createArticle(req: Request, res: Response) : Promise<void> {
    log.info("Create Article");

    if (req.body.name == null ||req.body.code_type_src == null) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create Type of Article : Fail - Missing Fields");      
      }
    else
      {
              await Article.create<Article>({ name: req.body.name, code_type_src: req.body.code_type_src})
                .then(() => {
                  res.status(204).end();
                  log.info("Create Article : OK");
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Article : Fail - ERROR");
                  log.error(err);
                });

                
      }
    
  }
  
  public async getAllArticle(req: Request,res: Response) : Promise<void> {
    log.info("Get all article");

    await Article.findAll<Article>({
      attributes : ['name','code_type_src','price','picture','description'],
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

  public async updateArticle(req: Request, res: Response) : Promise<void> {
    log.info("Update Article");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Article : Fail - Missing Fields");      
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
          res.status(404).json();
          res.end();
          log.error("Update Article : Fail - Article not exist");      
        }
      else
      {
        let countOK = 0;
        let countError = 0;

        if(req.body.name != null)
        {
          await Article.update({ name: req.body.name }, {
            where: {
              id: req.body.id
            }
          }).then(() => countOK++)
          .catch((err: Error,) => {
            countError++;
            log.error('Error with field name of Article : ' + err);
              });
          }

        if(req.body.code_type_src != null)
        {
          await Article.update({ code_type_src: req.body.code_type_src }, {
            where: {
              id: req.body.id
            }
          }).then(() => countOK++)
          .catch((err: Error,) => {
            countError++;
            log.error('Error with field code_type_src of Article : ' + err);
              });
        }

        if(req.body.price != null)
        {
          await Article.update({ price: req.body.price }, {
            where: {
              id: req.body.id
            }
          }).then(() => countOK++)
          .catch((err: Error,) => {
            countError++;
            log.error('Error with field price of Article : ' + err);
              });
        }

        if(req.body.picture != null)
        {
          await Article.update({ picture: req.body.picture }, {
            where: {
              id: req.body.id
            }
          }).then(() => countOK++)
          .catch((err: Error,) => {
            countError++;
            log.error('Error with field picture of Article : ' + err);
              });
        }

        if(req.body.description != null)
        {
          await Article.update({ description: req.body.description }, {
            where: {
              id: req.body.id
            }
          }).then(() => countOK++)
          .catch((err: Error,) => {
            countError++;
            log.error('Error with field description of Article : ' + err);
              });
        }

        if(countError == 0)
          {
            res.status(204);
            res.end();
            log.info("Update Article : OK");
          }
        else
          {
            res.status(409);
            res.end();
            log.warn("Update Article : OK with error - "+countOK+' update done only');
          }

      }

    }

  }

  public async deleteArticle(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article");

    if ( req.body.id == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Article : Fail - Missing Fields");      
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
            
        }).catch((errArticle: Error) => {
          res.status(500).end();
          log.error("Delete Article : Fail - ERROR");
          log.error(errArticle);
        });
      }
  }

  public async createMenu(req: Request, res: Response) : Promise<void> {
    log.info("Create Menu");

    if (req.body.name == null )
      {
            res.status(400).json({ error : 'Missing Fields' });
            res.end();
            log.error("Create Menu : Fail - Missing Fields");      
      }
    else
      {
          await MenuInfo.create<MenuInfo>({ name: req.body.name})
                .then(() => {
                  res.status(204).end();
                  log.info("Create Menu : OK");
                })
                .catch((err: Error) => {
                  res.status(500).end();
                  log.error("Create Menu : Fail - ERROR");
                  log.error(err);
                });
      }
    
  }

  public async getAllMenu(req: Request,res: Response) : Promise<void> {
    log.info("Get all Menu");

    await MenuInfo.findAll<MenuInfo>({
      attributes : ['id','name','description','price_final'],
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

      log.info("Get all Menu : OK");
    
    }).catch((err: Error) => {
      res.status(500).end();
      log.error("Get Menu : Fail - ERROR");
      log.error(err);
    });

  }

  public async getMenu(req: Request,res: Response) : Promise<void> {
    log.info("Get Menu")

    await MenuContent.findAll<MenuContent>({
      attributes : ['id_menu','id_article'],
      raw: true,
     include: [
      {model: MenuInfo, attributes: ['name','description','price_final']}, 
      {model: Article, attributes: ['name','code_type_src','price']} 
    ],
     where: {
      id_menu: req.params.id
    },
    }).then(function(data) { 

      if(data.length == 0)
        {
          res.status(204).end();
        }
      else
        {
          res.status(200).json(data).end();
        }

      log.info("Get Menu : OK");
    
    }).catch((err: Error) => {
              res.status(500).end();
              log.error("Get Menu : Fail - ERROR");
              log.error(err);
            });

  }

  public async addToMenu(req: Request,res: Response) : Promise<void> {
    log.info("Add Article to Menu");

    if ( req.body.id_article == null || req.body.id_menu == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Add Article to Menu : Fail - Missing Fields");      
      }
    else
    {
        await MenuContent.create<MenuContent>({  id_menu: req.body.id_menu, id_article: req.body.id_article})
            .then(() => {
              res.status(204).end();
              log.info("Add Article to Menu : OK");
            })
            .catch((err: Error) => {
              res.status(500).end();
              log.error("Add Article to Menu : Fail - ERROR");
              log.error(err);
            });
    }
  }

  public async deleteToMenu(req: Request,res: Response) : Promise<void> {
    log.info("Delete Article to Menu");

    if ( req.body.id_article == null || req.body.id_menu == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Article to Menu : Fail - Missing Fields");      
      }
    else
      {
        await MenuContent.destroy<MenuContent>({
          where: {
            id_article: req.body.id_article,
            id_menu: req.body.id_menu,
          }
        }).then(function(dataMenuArticle) { 
          if(dataMenuArticle == 0)
            {
              res.status(404).end();
              log.info("Delete Article to Menu : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Article to Menu : OK");
          }
            
        }).catch((errMenuArticle: Error) => {
          res.status(500).end();
          log.error("Delete Article to Menu : Fail - ERROR");
          log.error(errMenuArticle);
        });
      }
  }

  public async updateMenu(req: Request, res: Response) : Promise<void> {
    log.info("Update Menu");

    if ( req.body.id == null )
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Update Menu : Fail - Missing Fields");      
      }
    else
    {
      const idSearch = await MenuInfo.findAll<MenuInfo>({
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
          res.status(404).json();
          res.end();
          log.error("Update Menu : Fail - Menu not exist");      
        }
      else
      {
        let countK = 0;
        let countErr = 0;

        if(req.body.name != null)
        {
          await MenuInfo.update({ name: req.body.name }, {
            where: {
              id: req.body.id
            }
          }).then(() => countK++)
          .catch((err: Error,) => {
            countErr++;
            log.error('Error with field name of Menu : ' + err);
              });
          }

        if(req.body.price_final != null)
        {
          await MenuInfo.update({ price: req.body.price_final }, {
            where: {
              id: req.body.id
            }
          }).then(() => countK++)
          .catch((err: Error,) => {
            countErr++;
            log.error('Error with field price_final of Menu : ' + err);
              });
        }

        if(req.body.description != null)
        {
          await Article.update({ description: req.body.description }, {
            where: {
              id: req.body.id
            }
          }).then(() => countK++)
          .catch((err: Error,) => {
            countErr++;
            log.error('Error with field description of Menu : ' + err);
              });
        }

        if(countErr == 0)
          {
            res.status(204);
            res.end();
            log.info("Update Article : OK");
          }
        else
          {
            res.status(409);
            res.end();
            log.warn("Update Article : OK with error - "+countK+' update done only');
          }

      }

    }

  }

  public async deleteMenu(req: Request,res: Response) : Promise<void> {
    log.info("Delete Menu");

    if ( req.body.id == null ) // Si il manque un champ, on renvoi bad request
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Delete Menu : Fail - Missing Fields");      
      }
    else
      {
        await MenuInfo.destroy<MenuInfo>({
          where: {
            id: req.body.id
          }
        }).then(function(dataDeletMenu) { 
          if(dataDeletMenu == 0)
            {
              res.status(404).end();
              log.info("Delete Menu : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Menu : OK");
          }
            
        }).catch((errMenu: Error) => {
          res.status(500).end();
          log.error("Delete Menu : Fail - ERROR");
          log.error(errMenu);
        });
      }
  }

  public async createOrder(req: Request,res: Response) : Promise<void> {
    log.info("Create Order");

    if ( req.body.id_client == null || req.body.sold_before_order == null || req.body.total == null) 
      {
            res.status(400).json({ error : "Missing Fields" });
            res.end();
            log.error("Create Order : Fail - Missing Fields");      
      }
    else
    {
        await OrderInfo.create<OrderInfo>({  id_client: req.body.id_client, sold_before_order: req.body.sold_before_order, total: req.body.total})
            .then(() => {
              res.status(204).end();
              log.info("Create Order : OK");
            })
            .catch((err: Error) => {
              res.status(500).end();
              log.error("Create Order : Fail - ERROR");
              log.error(err);
            });
    }
  }

  public async getOrder(req: Request,res: Response) : Promise<void> {
    log.info("Get Order")

    await OrderInfo.findAll<OrderInfo>({
      attributes : ['id','id_client','sold_before_order','total'],
      raw: true,
      where: {
        id_client: req.params.id
      },
    }).then(function(dataOrder) { 

      if(dataOrder.length == 0)
        {
          res.status(204).end();
        }
      else
        {
          res.status(200).json(dataOrder).end();
        }

      log.info("Get Order : OK");
    
    }).catch((err: Error) => {
              res.status(500).end();
              log.error("Get Order : Fail - ERROR");
              log.error(err);
            });

  }

  public async deleteOrder(req: Request,res: Response) : Promise<void> {
    log.info("Delete Order");
        await OrderInfo.destroy<OrderInfo>({
          where: {
            id: req.params.id
          }
        }).then(function(dataOrder) { 
          if(dataOrder == 0)
            {
              res.status(404).end();
              log.info("Delete Order : Fail - Not found");
            }
          else
          {
              res.status(204).end();
              log.info("Delete Order : OK");
          }
            
        }).catch((errOrder: Error) => {
          res.status(500).end();
          log.error("Delete Order : Fail - ERROR");
          log.error(errOrder);
        });
      
  }

}