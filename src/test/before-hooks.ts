import { sequelize } from "../config/database";
import { log } from "../config/log_config";
import { User } from "../models/user";
import { Setting } from "../models/setting"
import bcrypt from "bcrypt";


before(function(done) {

  this.timeout(60000);
  log.info('Preparation of the test base');

  sequelize.sync({force: true}).then(async () => {
    let saltRounds = 10 ;
    let salt =  await bcrypt.genSalt(saltRounds);
    let password = process.env.COOKER_DEFAUT_PASSWORD!;
    let hash =  await bcrypt.hash(password,  salt);
    User.create({ first_name: 'Cantiniere', last_name: 'Responsable', email: process.env.COOKER_DEFAUT_EMAIL, password: hash, salt: salt, cooker: true });
    Setting.create();
    log.info('Synchronisation de la base réussi !');
    done();
    }).catch(err => {
    log.error('Erreur lors de la synchronisation de la base de donnée !');
    log.error(err);
    done();
  });

});
