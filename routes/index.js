const Sequelize = require('sequelize')
var express = require('express');
var router = express.Router();
const { Provider } = require('../models')
const { User } = require('../models')
const jwt = require('jsonwebtoken');
const withAuth = require('../middlewares/withauth');
const secret = 'secredcode';

const {gt, lte, ne, in: opIn} = Sequelize.Op;
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
  console.log(req.query);
});

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

router.get('/search',withAuth, function(req, res, next) {
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
      res.render('search', {providers});
    })
    .catch((error)=>{
      console.error(error);
      res.status(400).json({
        error: "bla bla"
      });
    })
});

module.exports = router;
