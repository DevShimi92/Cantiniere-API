import express from "express";
import cors from "cors";
import { Routes } from "./routes/routes";

class App {
  public app: express.Application;
  public routeApi: Routes = new Routes();
  public options ='';
  private corsOptions = {
    origin: process.env.WHITE_LIST_CORS_ORIGIN,
    optionsSuccessStatus: 200
}

  constructor() {
    this.app = express();
    this.config();
    this.routeApi.routes(this.app);
  }

 private config(): void { 
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));  
    this.app.use(cors(this.corsOptions)); 
    

  } 
}

export default new App().app;
