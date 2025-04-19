const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Position = sequelize.define('position', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    wallet: {type: DataTypes.STRING},
    date: {type: DataTypes.DATE},
    eventId: {type: DataTypes.INTEGER},
    yes: {type: DataTypes.BOOLEAN},
    amount: {type: DataTypes.FLOAT},
    price: {type: DataTypes.FLOAT},
    status: {type: DataTypes.STRING},
    positionId: {type: DataTypes.INTEGER},
    isClaimed: {type: DataTypes.BOOLEAN}
})

module.exports = {
    Position
}