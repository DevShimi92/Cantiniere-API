import  * as dotenv  from "dotenv";
import { Sequelize } from "sequelize";
import { log } from "./log_config";

dotenv.config();

let sslOptions;

if (process.env.SSL_OPTION == "Local")
  {
    sslOptions=false;
  }
else
  {
    sslOptions= {
      require: true,
      rejectUnauthorized: false 
    };
  }
  
export const sequelize  = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'postgres',
    protocol: 'postgres',
    logging: msg => log.trace(msg),
    dialectOptions: {
      ssl: sslOptions
    }
});

sequelize.authenticate().then(() => {
    log.info('Connexion a la base réussi ! ');
    
    }).catch(err => {
    log.error('Erreur lors de la connexion à la base de donnée !');
    log.error(err);
  });

  sequelize.sync().then(() => {
    log.info('Synchronisation de la base réussi !');
    
    }).catch(err => {
    log.error('Erreur lors de la synchronisation de la base de donnée !');
    log.error(err);
  });