const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const jwt = require('jsonwebtoken');
const withAuth = require('../middlewares/withauth');
const secret = 'secredcode';

chai.use(chaiHttp);
chai.should();

const payload = {username: "admin"};
const token = jwt.sign(payload, secret, {
    expiresIn: '1h'
});

describe("Providers", () => {
    before(function () {
        return require('../models').sequelize.sync();
    });
    describe("GET /", () => {
        it("login page", (done) => {
            chai.request(app)
                .post('/login')
                .send({username: 'admin', password: 'admin'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                 });
        });
        
        it("should get all providers record", (done) => {
             chai.request(app)
                 .get('/providers')
                 .set('x-access-token', token)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.an('array');
                     done();
                  });
         });

         it("should get a single provider record", (done) => {
            const id = 1;
            chai.request(app)
                .get(`/providers/${id}`)
                .set('x-access-token', token)
                .end((err, res) => {
                    console.log("fsf: ", res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                 });
        });
        
    });
});