import moduleTestPing from './src_test/module_test_ping';
import {moduleUser, moduleDeleteUser} from './src_test/module_test_user';
import {moduleTypeArticle, moduleDeleteTypeArticle} from './src_test/module_test_type_article';
import {moduleArticle, moduleDeleteArticle} from './src_test/module_test_article';
import {moduleMenuInfo, moduleDeleteMenuInfo} from './src_test/module_test_menu_info';
import {moduleMenuContent, moduleDeleteMenuContent} from './src_test/module_test_menu_content';
import {moduleOrderInfo, moduleDeleteOrderInfo}  from './src_test/module_test_order_info';

import { sequelize } from "../config/database";
import { log } from "../config/log_config";
    
before(function(done) {

    log.info('Preparation of the test base');

    sequelize.sync().then(() => {
      log.info('Synchronisation de la base réussi !');
      done();
      }).catch(err => {
      log.error('Erreur lors de la synchronisation de la base de donnée !');
      log.error(err);
      done();
    });

  });

describe('Test of API', function() {

    describe('Ping on api', moduleTestPing.bind(this));

    describe('Checking all method of models without delete data', function() {

        describe('Checking method of User model', moduleUser.bind(this));
  
       /* describe('Checking method of Type of Article model', moduleTypeArticle.bind(this));

        describe('Checking method of Article model', moduleArticle.bind(this));

        describe('Checking method of Menu Info model', moduleMenuInfo.bind(this));

        describe('Checking method of Menu Content model', moduleMenuContent.bind(this));

        describe('Checking method of Order Info model', moduleOrderInfo.bind(this));*/

    });

    /*describe('Checking all delete method of models', function() { 

        describe('Checking delete method of Order Info model', moduleDeleteOrderInfo.bind(this));

        describe('Checking delete method of User model', moduleDeleteUser.bind(this));

        describe('Checking delete method of Menu Content model', moduleDeleteMenuContent.bind(this));

        describe('Checking delete method of Menu Info model', moduleDeleteMenuInfo.bind(this));

        describe('Checking delete method of Article model', moduleDeleteArticle.bind(this));
  
        describe('Checking delete method of Type of Article model', moduleDeleteTypeArticle.bind(this));

    });*/

});
