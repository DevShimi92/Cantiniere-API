import request from "supertest";
import chai from "chai";
import app from "../../app";

let tokenAdmin : string ;
let token : string ;

chai.should();

export function moduleUser(): void {

    before(function(done)  {
        this.timeout(60000);
        const data = {
          "email":  process.env.COOKER_DEFAUT_EMAIL,
          "password": process.env.COOKER_DEFAUT_PASSWORD,
          };
        request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .send(data)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              tokenAdmin = res.body.token;
              done();
            });
    
      });
    
    it("Read All User - No Content", function (done) {
        this.timeout(60000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
        }); 

    it("Create User - Value too loong", function (done) {
            this.timeout(60000);
            const data = {
                "last_name": 'Name',
                "first_name": 'FirstNameOfTheHellYALAWHATTHEFUCKMANTHISISTOOLOONG',
                "email":  'email@email.com',
                "password": '1234',
            }
            request(app)
                .post('/user')
                .send(data)
                .set('Accept', 'application/json')
                .expect(500)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

    it("Create User - OK", function (done) {
        this.timeout(60000);
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
            .expect(201)
            .end((err,res) => {
                if (err) return done(err);
                res.body.should.have.property("token");
                token = res.body.token;
                done();
            });
        });

    it("Read All User - Found", function (done) {
        this.timeout(60000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(200,[{
                "id" : 2,
                "last_name": 'Name',
                "first_name": 'FirstName',
                "money": 0,
            }])
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });
    
    it("Read All User - User is not admin", function (done) {
        this.timeout(60000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Create User - Missing Fields", function (done) {
        this.timeout(60000);
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
        this.timeout(60000);
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
            .expect(409)
            .end((err) => {
                if (err) return done(err);
                done();
            });   
        });

    it("Update User - Missing Fields", function (done) {
        this.timeout(60000);
        const data = {
            "last_name": 'avvv',
            "first_name": 'zz',
        }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400,{ error : "Missing Fields"})
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Update User - ID IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id" : "NO"
        }
        request(app)
            .put('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send(data)
            .expect(400,{ error : "Number only" })
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Update User - Account not exist", function (done) {
        this.timeout(60000);
        const data = {
            "id": 5,
            "last_name": 'avvv',
            "first_name": 'zz',
        }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(404,{ error : 'Account not exist'})
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });
    
    it("Update User - First name too lonng", function (done) {
            this.timeout(60000);
            const data = {
                "id": 2,
                "last_name": 'avvv',
                "first_name": 'FirsrNameOfTheHellYALAWHATTHEFUCKMANTHISISTOOLOONG',
            }
            request(app)
                .put('/user')
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(409)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

    it("Update User - Last name too lonng", function (done) {
            this.timeout(60000);
            const data = {
                "id": 2,
                "last_name": 'lastNameOfTheHellYALAWHATTHEFUCKMANTHISISTOOLOONG',
                "first_name": 'zz',
            }
            request(app)
                .put('/user')
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(409)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    
    it("Update User - EMail too lonng", function (done) {
            this.timeout(60000);
            const data = {
                "id": 2,
                "last_name": 'avvv',
                "first_name": 'zz',
                "email":  'EMAILOfTheHellYALAWHATTHEFUCKMANTHISISTOOLOONGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
            }
            request(app)
                .put('/user')
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(409)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    
    it("Update User - Password too lonng", function (done) {
            this.timeout(60000);
            const data = {
                "id": 2,
                "last_name": 'avvv',
                "first_name": 'zz',
                "email":  'emailE@POemail.com',
                "password": 'SMELLOFTHEDEADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
            }
            request(app)
                .put('/user')
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(409)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });

    it("Update User - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id": 2,
            "last_name": 'avvv',
            "first_name": 'zz',
            "email":  'emailE@POemail.com',
            "password": '12345',
        }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Update User - User not admin add money", function (done) {
        this.timeout(60000);
        const data = {
            "id": 2,
            "money": 999
        }
            request(app)
                .put('/user')
                .send(data)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(204)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
            });

    it("Read All User - Check Update User ( money at 0)", function (done) {
        this.timeout(60000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(200,[{
                "id" : 2,
                "last_name": 'avvv',
                "first_name": 'zz',
                "money": 0,
            }])
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });
    
    it("Update User - User admin add money", function (done) {
        this.timeout(60000);
        const data = {
            "id": 2,
            "money": 999
            }
        request(app)
            .put('/user')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Read All User - Check Update User ( money at 0)", function (done) {
        this.timeout(60000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(200,[{
                "id" : 2,
                "last_name": 'avvv',
                "first_name": 'zz',
                "money": 999,
             }])
            .end((err) => {
            if (err) return done(err);
                done();
            });
        });

}

export function moduleDeleteUser(): void {

    it("Delete User - Unauthorized", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .expect(401)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete User - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete User - Forbidden", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 2
        }
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send(data)
            .expect(403)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete User - Not Found", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 99
        }
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete User - ID IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id" : "NO"
        }
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send(data)
            .expect(400,{ error : "Number only" })
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete User - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 2
        }
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Read All User - Check Delete User", function (done) {
        this.timeout(60000);
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}