import  * as dotenv  from "dotenv";
import { Sequelize } from "sequelize";
import { log } from "./log_config";

dotenv.config();

export const database  = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'postgres',
    protocol: 'postgres',
    logging: msg => log.trace(msg),
    dialectOptions: {
        ssl: true
    }
});

database.authenticate().then(() => {
    log.info('Connexion a la base réussi ! ');
    
    }).catch(err => {
    log.error('Erreur lors de la connexion à la base de donnée !');
    log.error(err);
  });

database.sync().then(() => {
    log.info('Synchronisation de la base réussi !');
    
    }).catch(err => {
    log.error('Erreur lors de la synchronisation de la base de donnée !');
    log.error(err);
  });