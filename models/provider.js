module.exports = (sequelize, type) => {
    return sequelize.define('provider', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        drgDefinition: {
            type: type.CHAR,
            length: 255
          },
        providerId: {
            type: type.INTEGER,
            length: 10
          },
        providerName: {
            type: type.CHAR,
            length: 255
          },
        providerStreetAddress: {
            type: type.CHAR,
            length: 255
          },
        providerCity: {
            type: type.CHAR,
            length: 255 
        },
        providerState: {
            type: type.CHAR,
            length: 10 
        },
        providerZipCode: {
            type: type.INTEGER,
            length: 10  
        },
        hospitalReferralRegionDescription:{
            type: type.CHAR,
            length: 255  
        },
        totalDischarges:{
            type: type.INTEGER,
            length: 10  
        },
        averageCoveredCharges:{
            type: type.CHAR,
            length: 255  
        },
        averageTotalPayments: {
            type: type.CHAR,
            length: 255 
        },
        averageMedicarePayments: {
            type: type.CHAR,
            length: 255 
        }  
    })
}