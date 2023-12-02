require('dotenv').config()
const { createServer } = require('./config/createServer')
const connectDB = require("./config/db")

connectDB()

const app = createServer()

const PORT= process.env.PORT || 3700

app.listen(PORT, ()=> console.log(`PORT listening on ${process.env.PORT}`))