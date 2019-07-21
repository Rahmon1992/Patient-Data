module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: type.CHAR,
          length: 255
        },
        password: {
          type: type.CHAR,
          length: 255
        }
    })
}