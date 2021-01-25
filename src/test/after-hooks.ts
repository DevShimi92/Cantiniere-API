import { sequelize } from "../config/database";
import { log } from "../config/log_config";

after(function(done) {

    log.info('Cleaning the test base');

    sequelize.sync({force: true}).then(() => {
      log.info('Synchronisation de la base réussi !');
      done();
      }).catch(err => {
      log.error('Erreur lors de la synchronisation de la base de donnée !');
      log.error(err);
      done();
    });

  });