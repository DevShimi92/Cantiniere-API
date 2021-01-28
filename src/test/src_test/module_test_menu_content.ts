import request from "supertest";
import app from "../../app";

export function moduleMenuContent(): void {
  
    it("Get One menu full - Not found", function (done) {
      this.timeout(60000);
      request(app)
          .get('/menu/1')
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Add Article to Menu - Missing Fields", function (done) {
      this.timeout(60000);
      const data = {
          "id_article": 1,
      }
      request(app)
          .post('/menu/content')
          .send(data)
          .set('Accept', 'application/json')
          .expect(400)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Add Article to Menu - OK", function (done) {
      this.timeout(60000);
      const data = {
          "id_article": 2,
          "id_menu": 1
      }
      request(app)
          .post('/menu/content')
          .send(data)
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Get One menu full - OK", function (done) {
      this.timeout(60000);
      request(app)
          .get('/menu/1')
          .set('Accept', 'application/json')
          .expect(200,[{
              "id_menu": 1,
              "id_article": 2,
              "MenuInfo.name": "menu_the_1",
              "MenuInfo.description": "idk",
              "MenuInfo.price_final": 0,
              "Article.name": "teteandcocori",
              "Article.code_type_src": 1,
              "Article.price": 10
          }])
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

}

export function moduleDeleteMenuContent(): void {

    it("Delete Article to Menu - Missing Fields", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
        }
        request(app)
            .delete('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Menu - Not found", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 1,
            "id_menu": 1
        }
        request(app)
            .delete('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Menu - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_menu": 1
        }
        request(app)
            .delete('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}