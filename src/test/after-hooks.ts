import { sequelize } from "../config/database";
import { log } from "../config/log_config";

// Not work on github action only.... i look in for later...

after(function() {
/*
    log.info('Cleaning the test base');

    sequelize.sync({force: true}).then(() => {
      log.info('Synchronisation de la base réussi !');
      done();
      }).catch(err => {
      log.error('Erreur lors de la synchronisation de la base de donnée !');
      log.error(err);
      done();
    });
*/
  });