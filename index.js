require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routes/index')

const PORT = process.env.PORT || 8001

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use('/images', express.static('images'))

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

