import request from "supertest";
import app from "../../app";

export function moduleOrderContent(): void {

  it("Get One Order full - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .get('/order/content')
            .set('Accept', 'application/json')
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            }); 
  });  

  it("Get One Order full - ID ORDER IS NOT A NUMBER", function (done) {
    this.timeout(60000);
    const data = {
      "id_order": 'NO',
      }
    request(app)
        .get('/menu/content')
        .set('Accept', 'application/json')
        .send(data)
        .expect(400)
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
  });

  it("Get One Order full - Not found", function (done) {
        this.timeout(60000);
        const data = {
          "id_order": 1,
          }
        request(app)
            .get('/order/content')
            .set('Accept', 'application/json')
            .send(data)
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
        .expect(204)
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
  });

  it("Get One order full - OK", function (done) {
    this.timeout(60000);
    const data = {
      "id_order": 1,
      }
    request(app)
        .get('/order/content')
        .set('Accept', 'application/json')
        .send(data)
        .expect(200,[
            {
                "price": null,
                "origin_price": null,
                "discout": 0,
                "OrderInfo.id_client": 1,
                "OrderInfo.sold_before_order": 10,
                "OrderInfo.total": 10,
                "Article.name": "teteandcocori",
                "Article.code_type_src": 1,
                "Article.price": 10
            }
        ])
        .end((err) => {
            if (err) return done(err);
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
        .expect(204)
        .end((err) => {
            if (err) return done(err);
            done();
        });
});

}