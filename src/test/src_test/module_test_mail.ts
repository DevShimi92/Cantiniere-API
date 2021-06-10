import request from "supertest";
import app from "../../app";

export default function moduleTestMail(): void {

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

}