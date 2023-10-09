const User = require("../models/User")
const asyncHandler = require("express-async-handler")
const requiredInputChecker = require("../helpers/requiredInputChecker")

const registerNewVolunteer = asyncHandler(async(req,res)=>{

    const {username, userId, password, role} = req.body

    if(requiredInputChecker(req.body)){
        return res.status(400).json({message: "All fields required"})
    }


    //NOT findById
    const duplicate = await User.findOne({userId}).lean().exec()

    if(duplicate){

        return res.status(400).json({message: "Alreday registered"})
    }

    const newVolunteer = new User({username, userId, password, role})

    await newVolunteer.save()

    //data.newVolunteer in front from queryFulfilled or unwrap()
    res.json({newVolunteer})
})

module.exports = {registerNewVolunteer};