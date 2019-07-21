const Sequelize = require('sequelize')
const UserModel = require('./user')
const ProviderModel = require('./provider')
const importer = require('../data/importer')

const path = require('path');

const sequelize = new Sequelize({
  storage: path.join(__dirname, '..', '/data/db.db'),
  dialect: 'sqlite',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const User = UserModel(sequelize, Sequelize)

const Provider = ProviderModel(sequelize, Sequelize)

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);
    importer(path.join(__dirname, '..', '/data/providers2.csv'), Provider);
    User.create({
      username: "admin",
      password: "admin"
    })
  })

module.exports = {
  User,
  Provider,
  sequelize
}