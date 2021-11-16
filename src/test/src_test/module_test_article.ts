import request from "supertest";
import app from "../../app";

let tokenAdmin : string ;
let token : string ;

export function moduleArticle(): void {
  
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

  it("Read All Article - No Content", function (done) {
    this.timeout(60000);
    request(app)
        .get('/article')
        .set('Accept', 'application/json')
        .expect(204)
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });

  it("Create article - Missing Fields", function (done) {
      this.timeout(60000);
      const data = {
          "name": 'tete',
      }
      request(app)
          .post('/article')
          .send(data)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Create article - code_type_src IS NOT A NUMBER", function (done) {
    this.timeout(60000);
    const data = {
        "name": 'tete',
        "code_type_src" : 'NO',
        "price": 10
    }
    request(app)
        .post('/article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Number only"})
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
  });

  it("Create article - price IS NOT A NUMBER", function (done) {
    this.timeout(60000);
    const data = {
        "name": 'tete',
        "code_type_src" : 1,
        "price": 'NO'
    }
    request(app)
        .post('/article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Number only"})
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
  });

  it("Create article - Bad code_type", function (done) {
      this.timeout(60000);
      const data = {
          "name": 'tete',
          "code_type_src" : 99,
          "price": 10
      }
      request(app)
          .post('/article')
          .send(data)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(500)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Create article - Unauthorized", function (done) {
    this.timeout(60000);
    const data = {
        "name": 'tete',
        "code_type_src" : 1
    }
    request(app)
        .post('/article')
        .send(data)
        .set('Accept', 'application/json')
        .expect(401)
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
  });

  it("Create article - Forbidden", function (done) {
    this.timeout(60000);
    const data = {
        "name": 'tete',
        "code_type_src" : 1,
        "price" : 10
    }
    request(app)
        .post('/article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(403)
        .end((err) => {
            if (err) return done(err);
            done();
        });
        
  });

  it("Create article - OK", function (done) {
      this.timeout(60000);
      const data = {
          "name": 'tete',
          "code_type_src" : 1,
          "price" : 10.5,
          "description":"WESHHHH"
      }
      request(app)
          .post('/article')
          .send(data)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(201)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
  });

  it("Read All Article - Found", function (done) {
      this.timeout(60000);
      request(app)
          .get('/article')
          .set('Accept', 'application/json')
          .expect(200,[{ "id" : 2 ,"name": 'tete', "code_type_src" : 1, "price": 10.5, "picture" : null , "description": "WESHHHH"}])
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Article - Missing Fields", function (done) {
      this.timeout(60000);
      request(app)
          .put('/article')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(400,{ error : "Missing Fields"})
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Article - ID IS NOT A NUMBER", function (done) {
    this.timeout(60000);
    const data = {
        "id" : 'NO',
        "name": 'teteandcocori',
        "price": 10,
        "picture" : "One_picture.html",
        "description" : 'idk'
    }
    request(app)
        .put('/article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Number only" })
        .end((err) => {
            if (err) return done(err);
            done();
        });
});

  it("Update Article - Article not exist", function (done) {
      this.timeout(60000);
      const data = {
          "id" : 99,
          "name": 'teteandcocori',
          "price": 10,
          "picture" : "One_picture.html",
          "description" : 'idk'
      }
      request(app)
          .put('/article')
          .send(data)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(404)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Article - Unauthorized", function (done) {
    this.timeout(60000);
    const data = {
        "id" : 2,
        "name": 'teteandcocori',
        "price": 10,
        "picture" : "One_picture.html",
        "description" : 'idk'
    }
    request(app)
        .put('/article')
        .send(data)
        .set('Accept', 'application/json')
        .expect(401)
        .end((err) => {
            if (err) return done(err);
            done();
        });
    });

  it("Update Article - Forbidden", function (done) {
    this.timeout(60000);
    const data = {
        "id" : 2,
        "name": 'teteandcocori',
        "price": 10,
        "picture" : "One_picture.html",
        "description" : 'idk'
    }
    request(app)
        .put('/article')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(403)
        .end((err) => {
            if (err) return done(err);
            done();
        });
    });

  it("Update Article - OK", function (done) {
      this.timeout(60000);
      const data = {
          "id" : 2,
          /*
              I found a bug with the id. I check this later.            
          */
          "name": 'teteandcocori',
          "price": 10,
          "picture" : "One_picture.html",
          "description" : 'idk'
      }
      request(app)
          .put('/article')
          .send(data)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Read All Article - Check Update Article", function (done) {
      this.timeout(60000);
      request(app)
          .get('/article')
          .set('Accept', 'application/json')
          .expect(200,[{ "id" : 2 , "name": 'teteandcocori', "code_type_src" : 1, "price": 10, "picture" : "One_picture.html" , "description": "idk"}])
          .end((err) => {
              if (err) return done(err);
              done();
          });
  });

  it("Update Article - Remove Picture", function (done) {
    this.timeout(60000);
    const data = {
        "id" : 2,
        /*
            I found a bug with the id. I check this later.            
        */
        "name": 'teteandcocori',
        "price": 10,
        "picture" : "",
        "description" : 'idk'
    }
    request(app)
        .put('/article')
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

export function moduleDeleteArticle(): void {

    it("Delete Article - Missing Fields", function (done) {
        this.timeout(60000);
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400,{ error : "Missing Fields" })
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article - ID IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 'NO'
        }
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(400,{ error : "Number only" })
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article - Not Found", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 99
        }
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article - Unauthorized", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 2
        }
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .send(data)
            .expect(401)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article - Forbidden", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 2
        }
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send(data)
            .expect(403)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 2
        }
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article with image - OK", function (done) {
        this.timeout(60000);
        const data = {
            "id" : 3
        }
        request(app)
            .delete('/article')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .send(data)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    }); 

    it("Read All Article - Check Delete Article", function (done) {
        this.timeout(60000);
        request(app)
            .get('/article')
            .set('Accept', 'application/json')
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}