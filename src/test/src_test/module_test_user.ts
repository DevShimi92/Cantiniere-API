import request from "supertest";
import chai from "chai";
import app from "../../app";

chai.should();

export function moduleUser(): void {
    
    it("Read All User - No Content", function (done) {
        this.timeout(60000);
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
                done();
            });
        });

    it("Read All User - Found", function (done) {
        this.timeout(60000);
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
            .expect(404,{ error : 'Account not exist'})
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Update User - OK", function (done) {
        this.timeout(60000);
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
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
        });

    it("Read All User - Check Update User", function (done) {
        this.timeout(60000);
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

}

export function moduleDeleteUser(): void {

    it("Delete User - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
            .expect(400)
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
            "id" : 1
        }
        request(app)
            .delete('/user')
            .set('Accept', 'application/json')
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
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}