import request from "supertest";
import app from "../app";
import { sequelize } from "../config/database";
import { log } from "../config/log_config";

describe('Test of API', function() {

    before(async function(){
        await sequelize.authenticate().then(() => {
            log.info('Connexion a la base réussi ! ');
            
            }).catch(err => {
            log.error('Erreur lors de la connexion à la base de donnée !');
            log.error(err);
          });
        
          await sequelize.sync({force: true}).then(() => {
            log.info('Synchronisation de la base réussi !');
            
            }).catch(err => {
            log.error('Erreur lors de la synchronisation de la base de donnée !');
            log.error(err);
          });
   });
    
    it("Ping on api", function (done) {
        this.timeout(15000);
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200,{message: "Cantiniere-API"}, done);
            
    });

    it("Create User - OK", function (done) {
        this.timeout(15000);
        const data = {
            "last_name": 'Name',
            "first_name": 'FirstName',
            "email":  'email@email.com',
            "password": '1234',
        }
        request(app)
            .post('/user')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err) => {
                if (err) return done(err);
            });
            done();
    });

    it("Create User - Missing Fields", function (done) {
        this.timeout(15000);
        const data = {
            "last_name": 'Name',
            "first_name": 'FirstName',
            "email":  'email@email.com',
        }
        request(app)
            .post('/user')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400,{ error : "Missing Fields"})
            .end((err) => {
                if (err) return done(err);
            });
            done();
    });

    it("Create User - Account already exist", function (done) {
        this.timeout(30000);
        const data = {
            "last_name": 'Name',
            "first_name": 'FirstName',
            "email":  'email@email.com',
            "password": '1234',
        }
        request(app)
            .post('/user')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400,{ error : "Account already exist"})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    


  });