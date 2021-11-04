import request from "supertest";
import app from "../../app";

let tokenAdmin : string ;
let token : string ;

export function moduleMenuContent(): void {

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
  
    it("Get One menu full - Not found", function (done) {
      this.timeout(60000);
      request(app)
          .get('/menu/content/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(204)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
    });

    it("Get One menu full - 404 Not found", function (done) {
        this.timeout(60000);
        request(app)
            .get('/menu/content/')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
            
    });

    it("Get One menu full - ID MENU IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        request(app)
            .get('/menu/content/NO')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
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
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(400)
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
    });

    it("Add Article to Menu - Unauthorized", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_menu": 1
        }
        request(app)
            .post('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .expect(401)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Add Article to Menu - Forbidden", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_menu": 1
        }
        request(app)
            .post('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
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
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Add Article to Menu - ID MENU AND ARTICLE IS NOT A NUMBER", function (done) {
      this.timeout(60000);
      const data = {
          "id_article": 'NO',
          "id_menu": 'NO'
      }
      request(app)
          .post('/menu/content')
          .send(data)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(400,{ error : "Number only" })
          .end((err) => {
              if (err) return done(err);
              done();
          });
          
    });

    it("Get One menu full - OK", function (done) {
      this.timeout(60000);
      request(app)
          .get('/menu/content/1')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + tokenAdmin)
          .expect(200,[{
              "id_menu": 1,
              "id_article": 2,
              "MenuInfo.name": "menu_the_1",
              "MenuInfo.description": "idk",
              "MenuInfo.price_final": 10,
              "Article.name": "teteandcocori",
              "Article.code_type_src": 1,
              "Article.price": 10,
              "Article.picture": ""
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
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Menu - ID MENU AND ARTICLE IS NOT A NUMBER", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 'NO',
            "id_menu" : 'NO'
            
        }
        request(app)
            .delete('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + tokenAdmin)
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
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Menu - Unauthorized", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_menu": 1
        }
        request(app)
            .delete('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .expect(401)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it("Delete Article to Menu - Forbidden", function (done) {
        this.timeout(60000);
        const data = {
            "id_article": 2,
            "id_menu": 1
        }
        request(app)
            .delete('/menu/content')
            .send(data)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(403)
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
            .set('Authorization', 'Bearer ' + tokenAdmin)
            .expect(204)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

}