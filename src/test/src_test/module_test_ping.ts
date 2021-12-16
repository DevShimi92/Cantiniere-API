import request from "supertest";
import app from "../../app";

export default function moduleTestPing(): void {
  it("Ping on api", function (done) {
    this.timeout(15000);
    request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(200,{message: "Cantiniere-API-22"}, done);
        
});
}