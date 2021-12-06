import request from "supertest";
import app from "../../app";

let tokenAdmin : string ;

let hourFormated :string ;

export default function moduleSetting(): void {

  before(function(done)  {
    this.timeout(60000);
    const loginAdmin = {
        "email":  process.env.COOKER_DEFAUT_EMAIL,
        "password": process.env.COOKER_DEFAUT_PASSWORD,
        };

    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginAdmin)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        tokenAdmin = res.body.token;
        done();
      });

  });

  it("Update hour limit method order - Missing Fields", function (done) {
    this.timeout(60000);

    request(app)
        .put('/setting/hour_limit')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Missing Fields"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update hour limit method order - Not formated", function (done) {
    this.timeout(60000);

    const data = {
        "hour_limit": 'NOTFORMATED',
    }
    request(app)
        .put('/setting/hour_limit')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Not formated"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });
  
  it("Update hour limit method order - OK", function (done) {
    this.timeout(60000);

    let hourNow = new Date;

    hourNow.setHours(hourNow.getHours() + 2);
    hourNow.setMinutes(hourNow.getMinutes() + 15);

    hourFormated = hourNow.toUTCString().slice(17, 25)

    const data = {
        "hour_limit": hourFormated,
    }
    request(app)
        .put('/setting/hour_limit')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(200)
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update total order limit of day - Missing Fields", function (done) {
    this.timeout(60000);

    request(app)
        .put('/setting/order_total_limit')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Missing Fields"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update total order limit of day - Not formated", function (done) {
    this.timeout(60000);

    const data = {
        "nb_limit_per_day": 'NOTFORMATED',
    }
    request(app)
        .put('/setting/order_total_limit')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Number only"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });
  
  it("Update total order limit of day - OK", function (done) {
    this.timeout(60000);

    const data = {
        "nb_limit_per_day": 15,
    }
    request(app)
        .put('/setting/order_total_limit')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(200)
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update total order limit of day per account - Missing Fields", function (done) {
    this.timeout(60000);

    request(app)
        .put('/setting/order_total_limit_account')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Missing Fields"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update total order limit of day per account - Not formated", function (done) {
    this.timeout(60000);

    const data = {
        "nb_limit_per_account": 'NOTFORMATED',
    }
    request(app)
        .put('/setting/order_total_limit_account')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Number only"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });
  
  it("Update total order limit of day per account - OK", function (done) {
    this.timeout(60000);

    const data = {
        "nb_limit_per_account": 2,
    }
    request(app)
        .put('/setting/order_total_limit_account')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(200)
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update Pre order value - Missing Fields", function (done) {
    this.timeout(60000);

    request(app)
        .put('/setting/pre_order')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Missing Fields"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Update Pre order value - Not formated", function (done) {
    this.timeout(60000);

    const data = {
        "order_in_advance": 'NOTFORMATED',
    }
    request(app)
        .put('/setting/pre_order')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(400,{ error : "Boolean only"})
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });
  
  it("Update Pre order value - OK", function (done) {
    this.timeout(60000);

    const data = {
        "order_in_advance": true,
    }
    request(app)
        .put('/setting/pre_order')
        .send(data)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(200)
        .end((err) => {
            if (err) return done(err);
            done();
        });

  });

  it("Get All Setting", function (done) {
    this.timeout(60000);
    
    request(app)
        .get('/setting/')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .expect(200,{ 
            hourlimit : hourFormated,
            totalOrderLimitDay :"15",
            totalOrderLimitAccountDay:"2",
            canPreOrder:"true"
            })
        .end((err) => {
            if (err) return done(err);
            done();
        });
  });

}