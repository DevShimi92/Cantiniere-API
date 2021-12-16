import request from "supertest";
import app from "../../app";

let tokenAdmin : string ;
let token : string ;

export function moduleTypeArticle(): void {

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
  
  it("Create Type of Article - Unauthorized", function (done) {
    this.timeout(60000);
    const data = {
        "name": 'coca'
    }
    request(app)
        .post('/type_article')
        .send(data)
        .set('Accept', 'application/json')
        .expect(401)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  }); 

  it("Create Type of Article - Forbidden", function (done) {
    this.timeout(60000);
    const data = {
        "name": 'coca'
    }
    request(app)
        .post('/type_article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(403)
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Type of Article - Unauthorized", function (done) {
    this.timeout(60000);
    const data = {
        "code_type": 1,
        "name" : 'Boisson'
    }
    request(app)
        .put('/type_article')
        .send(data)
        .set('Accept', 'application/json')
        .expect(401)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });

  it("Update Type of Article - Forbidden", function (done) {
    this.timeout(60000);
    const data = {
        "code_type": 1,
        "name" : 'Boisson'
    }
    request(app)
        .put('/type_article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(403)
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Type of Article - CODE TYPE IS NOT A NUMBER", function (done) {
    this.timeout(60000);
    const data = {
        "code_type": "NO",
        "name" : 'Boisson'
    }
    request(app)
        .put('/type_article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Number only for code_type"})
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
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

    it("Delete Type of Article - Unauthorized", function (done) {
        this.timeout(60000);
        const data = {
            "code_type" : 1
        }
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .send(data)
            .expect(401)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Type of Article - Forbidden", function (done) {
        this.timeout(60000);
        const data = {
            "code_type" : 1
        }
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send(data)
            .expect(403)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Type of Article - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400,{ error : "Missing Fields" })
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
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Type of Article - CODE TYPE IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "code_type" : "NO"
        }
        request(app)
            .delete('/type_article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(400,{ error : "Number only" })
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
            .set('Authorization', 'Bearer ' + tokenAdmin)
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