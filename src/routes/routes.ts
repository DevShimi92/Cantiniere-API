import { Application } from "express";
import { Controller } from "../controllers/controller";

export class Routes {
  
  private Controller: Controller = new Controller();

  public routes(app: Application): void {
    app.route("/").get(this.Controller.index);
  }
}