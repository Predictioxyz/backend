const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Event = sequelize.define('event', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    chance: { type: DataTypes.FLOAT },
    volume: { type: DataTypes.FLOAT },
    summary: { type: DataTypes.TEXT },
    rules: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE },
    yesName: { type: DataTypes.STRING },
    noName: { type: DataTypes.STRING },
    eventId: { type: DataTypes.INTEGER },
    isClosed: { type: DataTypes.BOOLEAN }
})

module.exports = {
    Event
}