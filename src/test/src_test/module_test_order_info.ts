import request from "supertest";
import app from "../../app";

export function moduleOrderInfo(): void {

  it("Get One Order - Not found", function (done) {
    this.timeout(60000);
    const data = {
      "id": 1
  }
    request(app)
        .get('/order')
        .set('Accept', 'application/json')
        .send(data)
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
        .expect(400)
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
});

  it("Create Order - OK", function (done) {
      this.timeout(60000);
      const data = {
          "id_client": 1,
          "sold_before_order": 10,
          "total":10
      }
      request(app)
          .post('/order')
          .send(data)
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Get One Order - Check Create Order", function (done) {
      this.timeout(60000);
      const data = {
        "id": 1
    }
      request(app)
          .get('/order')
          .set('Accept', 'application/json')
          .send(data)
          .expect(200,[{
              "id": 1,
              "id_client": 1,
              "sold_before_order": 10,
              "total": 10
          }])
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Get One Order - Missing Fields", function (done) {
    this.timeout(60000);
    request(app)
        .get('/order')
        .set('Accept', 'application/json')
        .expect(400,{ error : "Missing Fields" })
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
});

  it("Get One Order - NUMBER ONLY", function (done) {
      this.timeout(60000);
      const data = {
        "id": 'NO'
        }
      request(app)
          .get('/order')
          .set('Accept', 'application/json')
          .send(data)
          .expect(400,{ error : "Number only" })
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

}

export function moduleDeleteOrderInfo(): void {

    it("Delete Order - Not Found", function (done) {
        this.timeout(60000);
        const data = {
            "id": 2
        }
        request(app)
            .delete('/order')
            .set('Accept', 'application/json')
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
            "id": 'NO'
        }
        request(app)
            .delete('/order/1')
            .set('Accept', 'application/json')
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });


    it("Delete Order - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id": 1
        }
        request(app)
            .delete('/order')
            .set('Accept', 'application/json')
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}