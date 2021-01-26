import request from "supertest";
import app from "../../app";

export function moduleTypeArticle(): void {

  it("Read All Type of Article - No Content", function (done) {
    this.timeout(60000);
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
      this.timeout(60000);
      const data = {
          "name": 'coca'
      }
      request(app)
          .post('/type_article')
          .send(data)
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Read All Type of Article - Found ", function (done) {
      this.timeout(60000);
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
      this.timeout(60000);
      const data = {
          "name": 'coca'
      }
      request(app)
          .post('/type_article')
          .send(data)
          .set('Accept', 'application/json')
          .expect(409)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Create Type of Article - Missing Fields", function (done) {
      this.timeout(60000);
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
      this.timeout(60000);
      request(app)
          .put('/type_article')
          .set('Accept', 'application/json')
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Type of Article - Type of Article not exist", function (done) {
      this.timeout(60000);
      const data = {
          "code_type": 99,
          "name" : 'Boisson'
      }
      request(app)
          .put('/type_article')
          .send(data)
          .set('Accept', 'application/json')
          .expect(404)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Type of Article - OK", function (done) {
      this.timeout(60000);
      const data = {
          "code_type": 1,
          "name" : 'Boisson'
      }
      request(app)
          .put('/type_article')
          .send(data)
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Read All Type of Article - Check Update Type of Article ", function (done) {
      this.timeout(60000);
      request(app)
          .get('/type_article')
          .set('Accept', 'application/json')
          .expect(200,[{ code_type: 1, name: 'Boisson' }])
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });
  
}

export function moduleDeleteTypeArticle(): void {

    it("Delete Type of Article - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Type of Article - Not Found", function (done) {
        this.timeout(60000);
        const data = {
            "code_type" : 99
        }
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Type of Article - OK", function (done) {
        this.timeout(60000);
        const data = {
            "code_type" : 1
        }
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Read All Type of Article - Check Delete Type of Article ", function (done) {
        this.timeout(60000);
        request(app)
            .get('/type_article')
            .set('Accept', 'application/json')
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}