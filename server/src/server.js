require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/db')
const credentials = require('./middleware/credentials')
const verifyJWT = require('./middleware/verifyJWT')
const helmet = require('helmet')

const app = express()

connectDB()

// Handle options credentials check - before cors
app.use(credentials);

app.use(express.json())
app.use(helmet())
app.use(cors(corsOptions))
app.use(cookieParser());

app.use('/auth', require('./routes/authRoutes'))
app.use('/refresh', require('./routes/refreshRoute'))
app.use('/logout', require('./routes/logoutRoute'))
app.use('/register', require('./routes/registerRoute'))

app.use(verifyJWT)
app.use('/users', require('./routes/usersRoutes'))
app.use('/events', require('./routes/eventsRoutes'))

app.listen(process.env.PORT, ()=> console.log(`PORT listening on ${process.env.PORT}`))