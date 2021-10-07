import { Application } from "express";

import { DefaultController } from "../controllers/default_controller";
import { UserController } from "../controllers/user_controller";
import { TypeArticleController } from "../controllers/type_article_controller";
import { ArticleController } from "../controllers/article_controller";
import { MenuInfoController } from "../controllers/menu_info_controller";
import { MenuContentController } from "../controllers/menu_content_controller";
import { OrderInfoController } from "../controllers/order_info_controller";
import { OrderContentController } from "../controllers/order_content_controller";
import { AuthController } from "../controllers/auth_controller";
import { MailController } from "../controllers/mail_controller";
import { SettingController } from "../controllers/setting_controller";
import { ImageController } from "../controllers/image_controller";

import { AuthMiddleware } from "../middlewares/auth";
import { UploadImageMiddleware } from "../middlewares/upload_image"

export class Routes {
  
  private DefaultController: DefaultController = new DefaultController();
  private UserController: UserController = new UserController();
  private TypeArticleController: TypeArticleController = new TypeArticleController();
  private ArticleController: ArticleController = new ArticleController();
  private MenuInfoController: MenuInfoController = new MenuInfoController();
  private MenuContentController: MenuContentController = new MenuContentController();
  private OrderInfoController: OrderInfoController = new OrderInfoController();
  private OrderContentController: OrderContentController = new OrderContentController();
  private AuthController: AuthController = new AuthController();
  private MailController: MailController = new MailController();
  private SettingController: SettingController = new SettingController();
  private ImageController: ImageController = new ImageController();

  private AuthMiddleware: AuthMiddleware = new AuthMiddleware();
  private UploadImageMiddleware: UploadImageMiddleware = new UploadImageMiddleware();

  public routes(app: Application): void {

    app.route("/").get(this.DefaultController.index);
    app.route("/login").post(this.AuthController.login);
    app.route("/refresh_token").post(this.AuthController.refreshToken);
    app.route("/rest_password").post(this.UserController.restPassword);
    app.route("/mail").post(this.MailController.report);
    app.route("/forgot_password").post(this.MailController.forgotPasswordMail);
    

    app.use("/login_test",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, false, next));
    app.route("/login_test").post(this.AuthController.loginTest);


    app.route("/user").post(this.UserController.createUser);
    app.use("/user",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, false, next));
    app.route("/user").get(this.UserController.getAllUser);
    app.route("/user").put(this.UserController.updateUser);
    app.route("/user").delete(this.UserController.deleteUser);


    app.route("/type_article").get(this.TypeArticleController.getAllTypeArticle);
    app.use("/type_article",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.route("/type_article").post(this.TypeArticleController.createTypeArticle);
    app.route("/type_article").put(this.TypeArticleController.updateTypeArticle);
    app.route("/type_article").delete(this.TypeArticleController.deleteTypeArticle);

    app.route("/article").get(this.ArticleController.getAllArticle);
    app.use("/article",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.route("/article").put(this.ArticleController.updateArticle);
    app.route("/article").delete(this.ArticleController.deleteArticle);
    app.use("/article",(req, res, next) => this.UploadImageMiddleware.uploadImage(req, res, next));
    app.route("/article").post(this.ArticleController.createArticle);


    app.route("/menu").get(this.MenuInfoController.getAllMenu);
    app.route("/menu/content/:id_menu").get(this.MenuContentController.getMenu);
   
    app.use("/menu",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.route("/menu").post(this.MenuInfoController.createMenu);
    app.route("/menu").put(this.MenuInfoController.updateMenu);
    app.route("/menu").delete(this.MenuInfoController.deleteMenu);
    app.route("/menu/content").post(this.MenuContentController.addToMenu);
    app.route("/menu/content").delete(this.MenuContentController.deleteToMenu);


    app.use("/order",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, false, next));
    app.route("/order").post(this.OrderInfoController.createOrder);
    app.route("/order/content").post(this.OrderContentController.addToOrder);
    app.route("/order/content/:id_order").get(this.OrderContentController.getOrderContent);
    app.route("/order/:id_client").get(this.OrderInfoController.getOrder);
   
    app.use("/order",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.route("/order").delete(this.OrderInfoController.deleteOrder);
    app.route("/order/content").delete(this.OrderContentController.deleteToOrder);
    app.route("/order/valid").put(this.OrderInfoController.validOrder);

    app.use("/orderRecap",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.route("/orderRecap").get(this.OrderContentController.recapOrder);
    app.route("/orderRecap/all").get(this.OrderInfoController.getAllOrderForToday);

    app.route("/setting/hour_limit").get(this.SettingController.getHourLimit);
    app.use("/setting",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.route("/setting/").get(this.SettingController.getAllSetting);
    app.route("/setting/hour_limit").put(this.SettingController.updateHourLimit);
    app.route("/setting/order_total_limit").put(this.SettingController.updateTotalOrderLimitDay);
    app.route("/setting/order_total_limit_account").put(this.SettingController.updateTotalOrderLimitAccountPerDay);
    app.route("/setting/pre_order").put(this.SettingController.updatePreOrder);

    app.route("/image").get(this.ImageController.getImage);
    
    app.use("/image",(req, res, next) => this.AuthMiddleware.checkJWT(req, res, true, next));
    app.use("/image",(req, res, next) => this.UploadImageMiddleware.uploadImage(req, res, next));
    app.route("/image").put(this.ImageController.beforeImageProcessing);

  }
}