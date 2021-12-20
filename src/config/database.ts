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
    log.info('Connection to the base successful !');
    
    }).catch(err => {
    log.error('Error while connecting to the database !');
    log.error(err);
  });

  sequelize.sync().then(() => {
    log.info('Database synchronization successful !');
    
    }).catch(err => {
    log.error('Error during database synchronization! ');
    log.error(err);
  });