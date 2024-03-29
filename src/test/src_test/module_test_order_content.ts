import request from "supertest";
import app from "../../app";

let tokenAdmin : string ;
let token : string ;

export function moduleOrderContent(): void {

    before(function(done)  {
        this.timeout(60000);
        const loginAdmin = {
            "email":  process.env.COOKER_DEFAUT_EMAIL,
            "password": process.env.COOKER_DEFAUT_PASSWORD,
            };
        
        const login = {
            "email": 'emailE@POemail.com',
            "password": 'Test92I*-',
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

    it("Get One Order full - Missing Fields", function (done) {
            this.timeout(60000);
            request(app)
                .get('/order/content')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                }); 
    });  

    it("Get One Order full - ID ORDER IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/content/NO')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get One Order full - Not found", function (done) {
            this.timeout(60000);
            request(app)
                .get('/order/content/1')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(204)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
    });  

    it("Get Recap Order for one day - Unauthorized", function (done) {
        this.timeout(60000);
        request(app)
            .get('/orderRecap/qsdqs')
            .set('Accept', 'application/json')
            .expect(401)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get Recap Order for one day - Forbidden", function (done) {
        this.timeout(60000);
        request(app)
            .get('/orderRecap/dsqd')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get Recap Order for one day - Not found (as page)", function (done) {
        this.timeout(60000);
        request(app)
            .get('/orderRecap/')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get Recap Order for one day - Bad format", function (done) {
        this.timeout(60000);
        request(app)
            .get('/orderRecap/nkdfhfd')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get Recap Order for one day - Not found", function (done) {
        this.timeout(60000);
        request(app)
            .get('/orderRecap/1990-01-01')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Add Article to Order - Missing Fields", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 1,
        }
        request(app)
            .post('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Add Article to Order - ID ORDER AND ARTICLE IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 'NO',
            "id_order": 'NO'
        }
        request(app)
            .post('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(400,{ error : "Number only" })
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Add Article to Order - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_order": 1
        }
        request(app)
            .post('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get One order full - OK", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/content/1')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(200,[
                {
                    "price": null,
                    "origin_price": null,
                    "discout": 0,
                    "OrderInfo.id_client": 2,
                    "OrderInfo.sold_before_order": 999,
                    "OrderInfo.total": 10,
                    "Article.name": "teteandcocori",
                    "Article.code_type_src": 1,
                    "Article.price": 10,
                    "MenuInfo.id": null,
                    "MenuInfo.name": null,
                    "MenuInfo.price_final": null
                }
            ])
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get Recap Order for one day - Found", function (done) {
        this.timeout(60000);
        const date = new Date();
        const dateString = date.toISOString().slice(0, 10)
        request(app)
            .get('/orderRecap/'+dateString)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(200)
            .end((err,res) => {
                if (err) return done(err);
                res.body[0].should.have.property("id_article",2);
                res.body[0].should.have.property("nombre",'1');
                res.body[0].should.have.property("Article.name",'teteandcocori');
                res.body[0].should.have.property("OrderInfo.date_order",dateString);
                done();
            });
            
    });

}

export function moduleDeleteOrderContent(): void {

    it("Delete Article to Order - Missing Fields", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
        }
        request(app)
            .delete('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Order - ID ORDER AND ARTICLE IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 'NO',
            "id_order" : 'NO'
            
        }
        request(app)
            .delete('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Order - Not found", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 1,
            "id_order": 1
        }
        request(app)
            .delete('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    }); 

    it("Delete Article to Order - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_order": 1
        }
        request(app)
            .delete('/order/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}