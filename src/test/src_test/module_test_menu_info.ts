import request from "supertest";
import app from "../../app";

export function moduleMenuInfo(): void {

  it("Read All Menu - No Content", function (done) {
    this.timeout(60000);
    request(app)
        .get('/menu')
        .set('Accept', 'application/json')
        .expect(204)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });

  it("Create Menu - Missing Fields", function (done) {
      this.timeout(60000);
      request(app)
          .post('/menu')
          .set('Accept', 'application/json')
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Create Menu - OK", function (done) {
      this.timeout(60000);
      const data = {
          "name": 'menu1',
      }
      request(app)
          .post('/menu')
          .send(data)
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Read All Menu - Found", function (done) {
      this.timeout(60000);
      request(app)
          .get('/menu')
          .set('Accept', 'application/json')
          .expect(200,[{ "id": 1, "name": 'menu1', "price_final": 0, "description": null}])
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Menu - Missing Fields", function (done) {
      this.timeout(60000);
      request(app)
          .put('/menu')
          .set('Accept', 'application/json')
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Menu - Menu not exist", function (done) {
      this.timeout(60000);
      const data = {
          "id" : 99,
          "name": 'menu_the_1',
          "price_final": 10,
          "description" : 'idk'
      }
      request(app)
          .put('/menu')
          .send(data)
          .set('Accept', 'application/json')
          .expect(404)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Menu - ID IS NOT NUMBER", function (done) {
    this.timeout(60000);
    const data = {
        "id" : 'NO',
        "name": 'menu_the_1',
        "price_final": 10,
        "description" : 'idk'
    }
    request(app)
        .put('/menu')
        .send(data)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err) => {
            if (err) return done(err);
            done();
        });
});

  it("Update Menu - OK", function (done) {
      this.timeout(60000);
      const data = {
          "id" : 1,
          "name": 'menu_the_1',
          "price_final": 10,
          "description" : 'idk'
      }
      request(app)
          .put('/menu')
          .send(data)
          .set('Accept', 'application/json')
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

}

export function moduleDeleteMenuInfo(): void {

    it("Delete Menu - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/menu')
            .set('Accept', 'application/json')
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Menu - ID IS NOT NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 'NO'
        }
        request(app)
            .delete('/menu')
            .set('Accept', 'application/json')
            .send(data)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Menu - Not Found", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 99
        }
        request(app)
            .delete('/menu')
            .set('Accept', 'application/json')
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Menu - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 1
        }
        request(app)
            .delete('/menu')
            .set('Accept', 'application/json')
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}