import { sequelize } from "../config/database";
import { log } from "../config/log_config";

after(function(done) {

  this.timeout(60000);    
  log.info('Cleaning the test base');

  sequelize.sync({force: true}).then(() => {
    log.info('Database synchronization successful !');
    done();
    }).catch(err => {
    log.error('Error during database synchronization !');
    log.error(err);
    done();
  });

});
