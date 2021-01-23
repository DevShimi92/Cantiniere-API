import { Application } from "express";
import { Controller } from "../controllers/controller";

export class Routes {
  
  private Controller: Controller = new Controller();

  public routes(app: Application): void {
    app.route("/").get(this.Controller.index);
    app.route("/user").post(this.Controller.createUser);
    app.route("/user").get(this.Controller.getAllUser);
    app.route("/user").put(this.Controller.updateUser);
    app.route("/user").delete(this.Controller.deleteUser);
    app.route("/type_article").post(this.Controller.createTypeArticle);
    app.route("/type_article").get(this.Controller.getAllTypeArticle);
    app.route("/type_article").put(this.Controller.updateTypeArticle);
    app.route("/type_article").delete(this.Controller.deleteTypeArticle);
    app.route("/article").post(this.Controller.createArticle);
    app.route("/article").get(this.Controller.getAllArticle);
    app.route("/article").put(this.Controller.updateArticle);
    app.route("/article").delete(this.Controller.deleteArticle);
  }
}