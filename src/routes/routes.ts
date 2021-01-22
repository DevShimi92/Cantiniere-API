import { Application } from "express";
import { Controller } from "../controllers/controller";

export class Routes {
  
  private Controller: Controller = new Controller();

  public routes(app: Application): void {
    app.route("/").get(this.Controller.index);
    app.route("/user").post(this.Controller.createUser);
    app.route("/user").get(this.Controller.getAllUser);
    app.route("/user").put(this.Controller.updateUser);
    app.route("/type_article").post(this.Controller.createTypeArticle);
    app.route("/type_article").get(this.Controller.getAllTypeArticle);
    app.route("/type_article").put(this.Controller.updateTypeArticle);

  }
}