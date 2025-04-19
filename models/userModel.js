const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    wallet: {type: DataTypes.STRING},
    balance: {type: DataTypes.FLOAT},
    volume: {type: DataTypes.FLOAT},
    positions: {type: DataTypes.ARRAY(DataTypes.INTEGER)},
    watchlist: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] },
})

module.exports = {
    User
}