import request from "supertest";
import app from "../config/app";

describe('Test of API', function() {
    
    it("Ping on api", function (done) {
        this.timeout(15000);
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200,{message: "Cantiniere-API"}, done);
            
    });
  });