import request from "supertest";
import app from "../app";
import { sequelize } from "../config/database";
import { log } from "../config/log_config";

describe('Test of API', function() {
    
    it("Ping on api", function (done) {
        this.timeout(15000);
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200,{message: "Cantiniere-API"}, done);
            
    });

    it("Read All User - No Content", function (done) {
        this.timeout(15000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
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
                done();
            });
            
            
    });

    it("Read All User - Found", function (done) {
        this.timeout(15000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect(200,[{
                "id" : 1,
                "last_name": 'Name',
                "first_name": 'FirstName',
                "money": 0,
            }])
            .end((err) => {
                if (err) return done(err);
                done();
            });
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
                done();
            });
            
    });

    it("Create User - Account already exist", function (done) {
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
            .expect(409,{ error : "Account already exist"})
            .end((err) => {
                if (err) return done(err);
                done();
            });   
    });

    it("Update User - Missing Fields", function (done) {
        this.timeout(15000);
        const data = {
            "last_name": 'avvv',
            "first_name": 'zz',
        }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400,{ error : "Missing Fields"})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Update User - Account not exist", function (done) {
        this.timeout(15000);
        const data = {
            "id": 5,
            "last_name": 'avvv',
            "first_name": 'zz',
        }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400,{ error : 'Account not exist'})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Update User - OK", function (done) {
        this.timeout(15000);
        const data = {
            "id": 1,
            "last_name": 'avvv',
            "first_name": 'zz',
            "email":  'emailE@POemail.com',
            "password": '12345',
        }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200,{ msg : "4 update done"})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Read All User - Check Update User", function (done) {
        this.timeout(15000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .expect(200,[{
                "id" : 1,
                "last_name": 'avvv',
                "first_name": 'zz',
                "money": 0,
            }])
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Read All Type of Article - No Content", function (done) {
        this.timeout(15000);
        request(app)
            .get('/type_article')
            .set('Accept', 'application/json')
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Create Type of Article - OK", function (done) {
        this.timeout(15000);
        const data = {
            "name": 'coca'
        }
        request(app)
            .post('/type_article')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Read All Type of Article - Found ", function (done) {
        this.timeout(15000);
        request(app)
            .get('/type_article')
            .set('Accept', 'application/json')
            .expect(200,[{ code_type: 1, name: 'coca' }])
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Create Type of Article - Article already exist", function (done) {
        this.timeout(15000);
        const data = {
            "name": 'coca'
        }
        request(app)
            .post('/type_article')
            .send(data)
            .set('Accept', 'application/json')
            .expect(409,{ error : 'Article already exist' })
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Create Type of Article - Missing Fields", function (done) {
        this.timeout(15000);
        request(app)
            .post('/type_article')
            .set('Accept', 'application/json')
            .expect(400,{ error : "Missing Fields"})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Update Type of Article - Missing Fields", function (done) {
        this.timeout(15000);
        request(app)
            .put('/type_article')
            .set('Accept', 'application/json')
            .expect(400,{ error : "Missing Fields"})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Update Type of Article - OK", function (done) {
        this.timeout(15000);
        const data = {
            "code_type": 1,
            "name" : 'Boisson'
        }
        request(app)
            .put('/type_article')
            .send(data)
            .set('Accept', 'application/json')
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Read All Type of Article - Check Update Type of Article ", function (done) {
        this.timeout(15000);
        request(app)
            .get('/type_article')
            .set('Accept', 'application/json')
            .expect(200,[{ code_type: 1, name: 'Boisson' }])
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    after(function(done) {

        sequelize.sync({force: true}).then(() => {
            log.info('Synchronisation de la base réussi !');
            done();
            }).catch(err => {
            log.error('Erreur lors de la synchronisation de la base de donnée !');
            log.error(err);
            done();
          });

    });
  });