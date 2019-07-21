# Patient-Data

In this project created of an internal API & Search page for a national healthcare provider. This provider has a set of inpatient prospective payment systems providers. Date taken from here: https://drive.google.com/file/d/1AuXjrDoebQzra7wvY9wkpM9PlIp6Sntv/view

### Built With
This project was implemented based on Model-View-Controller(MVC) architecture. Uploaded data from csv to Sqlite DB.
* Node.js
* Express.js
* Jade
* Bootstrap
* Sqlite

### Demonstrations
### 1) Implemented Login page with authentication
```javascript
router.post('/login', function(req, res, next) {
  let where = {};
  console.log(req.body);
  if(req.body.username && req.body.password){
    where.username = req.body.username;
    where.password = req.body.password;
  }
  User.findOne({
    where
  }).then((user)=>{
    if(user){
      const payload = {username: user.username};
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      res.cookie('token', token, { httpOnly: true })
        .status(200);
      res.redirect('/search');
    }
    else
    {
      res.redirect('/');
    }
  })
});
```

![alt text](https://github.com/Rahmon1992/Patient-Data/blob/master/screenshots/login.PNG )


### 2) Implemented resposive web page with filtres and results
```
each item in providers
    .card
      .card-body
        h5.card-title #{item.providerName}
        h6.card-subtitle #{item.drgDefinition}
        .row.mt-3
          .col-6
            address 
              div #{item.providerStreetAddress}
              div #{item.providerCity}, #{item.providerState}, #{item.providerZipCode} 
              div #{item.hospitalReferralRegionDescription}
          .col-6
            div #{"Total discharges: " + item.totalDischarges} 
            div #{"Average Covered Charges: " + item.averageCoveredCharges} 
            div #{"Average Total Payments : " + item.averageTotalPayments}
            div #{"Average Medicare Payments : " + item.averageMedicarePayments}
```
![alt text](https://github.com/Rahmon1992/Patient-Data/blob/master/screenshots/search.PNG )


### 3) Implemented API with feature to select which fields are returned during an api request
```javascript
const {gt, lte, ne, in: opIn} = Sequelize.Op;
router.get('/', withAuth, function(req, res, next) {
  let where = {};
  if(req.query.max_discharges) where.totalDischarges = {[lte]: req.query.max_discharges};
  if(req.query.min_discharges) where.totalDischarges = {[gt]: req.query.min_discharges};
  if(req.query.max_average_covered_charges) where.averageCoveredCharges = {[lte]: req.query.max_average_covered_charges};
  if(req.query.min_average_covered_charges) where.averageCoveredCharges = {[gt]: req.query.min_average_covered_charges};
  if(req.query.max_average_medicare_payments) where.averageMedicarePayments = {[lte]: req.query.max_average_medicare_payments};
  if(req.query.min_average_medicare_payments) where.averageMedicarePayments = {[gt]: req.query.min_average_medicare_payments};
  if(req.query.state) where.providerState = req.query.state; 
  Provider.findAll({
    where
  }).then((providers)=>{
    if(req.query.fields)
    {
      var fields = req.query.fields.split(",");
      var result = providers.map(p => _.pick(p.toJSON(),fields));
      res.json(result);
    }
    else
      res.json(providers);
    })
    .catch((error)=>{
      console.error(error);
      res.status(400).json({
        error: "bla bla"
      });
    })
  
});
```
![alt text](https://github.com/Rahmon1992/Patient-Data/blob/master/screenshots/api.PNG )


### 4) Implemented Automated tests
```javascript
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
```

![alt text](https://github.com/Rahmon1992/Patient-Data/blob/master/screenshots/tests.PNG )
