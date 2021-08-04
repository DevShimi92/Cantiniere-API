import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app";

export default function moduleMail(): void {

  let rest_token : string;

  it("Report Support - Missing Fields", function (done) {
    this.timeout(15000);
    request(app)
        .post('/mail')
        .set('Accept', 'application/json')
        .expect(400,{ error : "Missing Fields"})
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });

  it("Report Support - Email Send without account", function (done) {
    this.timeout(15000);
    const data = {
      "subject": 'emailE@POemail.com',
      "message": 'teest',
      };

    request(app)
        .post('/mail')
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });

  it("Report Support - Email Send with account", function (done) {
    this.timeout(15000);
    const data = {
      "id" : 1 ,
      "subject": 'emailE@POemail.com',
      "message": 'teest',
      };

    request(app)
        .post('/mail')
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });
  
  
  it("Forgot Password - Missing Fields", function (done) {
    this.timeout(15000);
    request(app)
        .post('/forgot_password')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });

  it("Forgot Password - Email Send ", function (done) {
    this.timeout(15000);
    const data = {
      "email": 'emailE@POemail.com'
      };
    request(app)
        .post('/forgot_password')
        .send(data)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });

  it("Rest Password - Missing Fields", function (done) {
    this.timeout(15000);
    request(app)
        .post('/rest_password')
        .set('Accept', 'application/json')
        .expect(400,{ error : "Missing Fields"})
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });

  it("Rest Password - Token not vaid", function (done) {
    this.timeout(15000);
    const data = {
      "password": 'NEw'
      };
    rest_token = jwt.sign("FAKETOKENNOTVALID",process.env.SECRET_KEY_REST_TEST);
    request(app)
        .post('/rest_password')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + rest_token)
        .send(data)
        .expect(401)
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });

  it("Rest Password - Success ", function (done) {
    this.timeout(15000);
    const data = {
      "password": 'NEw'
      };
    rest_token = jwt.sign("FAKETOKEN",process.env.SECRET_KEY_REST_TEST);
    request(app)
        .post('/rest_password')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + rest_token)
        .send(data)
        .expect(200)
        .end((err) => {
              if (err) return done(err);
              done();
         });
        
  });
}