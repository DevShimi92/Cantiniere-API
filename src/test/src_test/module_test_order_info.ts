import request from "supertest";
import app from "../../app";

let tokenAdmin : string ;
let token : string ;

export function moduleOrderInfo(): void {

    before(function(done)  {
        this.timeout(60000);
        const loginAdmin = {
            "email":  process.env.COOKER_DEFAUT_EMAIL,
            "password": process.env.COOKER_DEFAUT_PASSWORD,
            };
        
        const login = {
            "email": 'emailE@POemail.com',
            "password": '12345',
            };

        request(app)
          .post('/login')
          .set('Accept', 'application/json')
          .send(loginAdmin)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            tokenAdmin = res.body.token;
          });

        request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .send(login)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              token = res.body.token;
              done();
            });
    
    });

    it("Get One Order - Not found", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Create Order - Missing Fields", function (done) {
        this.timeout(60000);
        const data = {
            "id_client": 1,
            "sold_before_order": 10,
        }
        request(app)
            .post('/order')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Create Order - ONLY NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id_client": 'NO',
            "sold_before_order": 'AND',
            "total": 'NOO'
        }
        request(app)
            .post('/order')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Create Order - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id_client": 2,
            "sold_before_order": 999,
            "total":10
        }
        request(app)
            .post('/order')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err,res) => {
                if (err) return done(err);
                res.body.should.have.property("id");
                done();
            });
            
    });

    it("Get One Order - Check Create Order", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/2')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err,res) => {
                if (err) return done(err);
                res.body[0].should.have.property("id",1);
                res.body[0].should.have.property("createdAt");
                res.body[0].should.have.property("total",10);
                res.body[0].should.have.property("done",false);
                done();
            });
            
    });

    it("Valid Order - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .put('/order/valid')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Valid Order - ONLY NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": 'NO',
        }
        request(app)
            .put('/order/valid')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Valid Order -NOT FOUND", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": '2',
        }
        request(app)
            .put('/order/valid')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Valid Order -DONE", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": '1',
        }
        request(app)
            .put('/order/valid')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Valid Order - Check Create Order", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/2')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err,res) => {
                if (err) return done(err);
                res.body[0].should.have.property("id",1);
                res.body[0].should.have.property("createdAt");
                res.body[0].should.have.property("total",10);
                res.body[0].should.have.property("done",true);
                done();
            });
            
    });



    it("Create Order - Balance incorrect", function (done) {
        this.timeout(60000);
        const data = {
            "id_client": 2,
            "sold_before_order": 999,
            "total":10
        }
        request(app)
            .post('/order')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
            .end((err,res) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get One Order - Missing Fields ( Forbidden )", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get One Order - NUMBER ONLY", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/N')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400,{ error : "Number only" })
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

}

export function moduleDeleteOrderInfo(): void {

    it("Delete Order - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/order')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Order - Not Found", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": 2
        }
        request(app)
            .delete('/order')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Order - ID IS NOT NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": "AHABFAIHUEFB"
        }
        request(app)
            .delete('/order')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Order - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": 1
        }
        request(app)
            .delete('/order')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Order - Check sold update", function (done) {
        this.timeout(60000);
        const data = {
            "id_order": 1
        }
        request(app)
            .get('/user')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
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