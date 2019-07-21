const Sequelize = require('sequelize')
var express = require('express');
var router = express.Router();
var _ = require('lodash');
const { Provider } = require('../models')
const withAuth = require('../middlewares/withauth');

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

router.get('/:id', withAuth, function(req, res, next) {
  Provider.findByPk(req.params.id)
  .then((providers)=>{
      res.json(providers);
    })
    .catch((error)=>{
      console.error(error);
      res.status(400).json({
        error: "bla bla"
      });
    })
  
});

module.exports = router;
