
const mongoose = require('mongoose')

const connectDB = () => {

    try {
        mongoose
        .connect(process.env.MONGODB_URI)
        .then(()=> {console.log('DB connected')})

    } catch (error) {
        console.error(error)
    }
}

module.exports = connectDB
