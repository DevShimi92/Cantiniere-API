import request from "supertest";
import app from "../../app";

export default function moduleToken(): void {

  let token : string ;
  let refresh_token : string ;

  it("Login method - Missing Fields", function (done) {
    this.timeout(60000);
    const data = {
      "email":  'emailE@POemail.com',
     }
    request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send(data)
        .expect(400,{ error : 'Missing Fields' })
        .end((err) => {
          if (err) return done(err);
          done();
        });
  });

  it("Login method - Account not found", function (done) {
    this.timeout(60000);
    const data = {
      "email":  'emailE@POemaiaal.com',
      "password": ''
     }
    request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send(data)
        .expect(401)
        .end((err) => {
          if (err) return done(err);
          done();
        });
  });

  it("Login method - Bad Password", function (done) {
    this.timeout(60000);
    const data = {
      "email":  'emailE@POemail.com',
      "password": 'nbvhfgvcffhc'
     }
    request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send(data)
        .expect(401)
        .end((err) => {
          if (err) return done(err);
          done();
        });
  });

  it("Login method - Get token", function (done) {
    this.timeout(60000);
    const data = {
      "email":  'emailE@POemail.com',
      "password": '12345',
      }
    request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send(data)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          token = res.body.token;
          refresh_token = res.body.refresh_token;
          done();
        });

  });

  it("Login method - Try without the token", function (done) {
    this.timeout(60000);
    request(app)
        .post('/login_test')
        .set('Accept', 'application/json')
        .expect(401)
        .end((err) => {
          if (err) return done(err);
          done();
        });

  });

  it("Login method - Try with the bad token", function (done) {
    this.timeout(60000);
    request(app)
        .post('/login_test')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + 'dqfqisduhyfbdusguhsfuhb')
        .expect(401)
        .end((err) => {
          if (err) return done(err);
          done();
        });

  });

  it("Login method - Try with the good token", function (done) {
    this.timeout(60000);
    request(app)
        .post('/login_test')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200,{ hell: 'yeah'})
        .end((err) => {
          if (err) return done(err);
          done();
        });

  });

  it("Refresh token method -  Missing Fields", function (done) {
    this.timeout(60000);
    request(app)
        .post('/refresh_token')
        .set('Accept', 'application/json')
        .expect(400,{ error : 'Missing Fields' })
        .end((err) => {
          if (err) return done(err);
          done();
        });

  });

  it("Refresh token method -  NOT FOUND", function (done) {
    this.timeout(60000);
    const data = {
      "id": '3',
      "refreshToken": 'BAD TOKEN',
      }
    request(app)
        .post('/refresh_token')
        .set('Accept', 'application/json')
        .send(data)
        .expect(403)
        .end((err) => {
          if (err) return done(err);
          done();
        });

  });

  it("Refresh token method -  OK", function (done) {
    this.timeout(60000);
    const data = {
      "id": '2',
      "refreshToken": refresh_token,
      }
    request(app)
        .post('/refresh_token')
        .set('Accept', 'application/json')
        .send(data)
        .expect(200)
        .end((err,res) => {
          if (err) return done(err);
          res.body.should.have.property("token");
          res.body.should.have.property("refresh_token");
          done();
        });

  });

}