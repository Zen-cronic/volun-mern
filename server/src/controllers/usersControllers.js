const asyncHandler = require("express-async-handler");
const requiredInputChecker = require("../helpers/requiredInputChecker");
const bcrypt = require('bcrypt');
const Event = require("../models/Event");
const User = require("../models/User");
const toLowerNoSpace = require("../helpers/toLowerNoSpace");
const { ROLES } = require("../config/roles");
const sortOrder = require("../helpers/sortOrder");
const {isAfter, isBefore} = require('date-fns');
const { SORT_OBJECT } = require("../config/sortOptions");
const objKeysIncludes = require("../helpers/objKeysIncludes");
const objPropExtractor = require("../helpers/objPropExtractor");

const createNewVolunteer = asyncHandler(async(req,res)=>{

    const {username, userId, password} = req.body

    if(requiredInputChecker(req.body)){
        return res.status(400).json({message: "All fields required"})
    }

    //more validators --

    //NOT findById
    const duplicate = await User.findOne({userId}).lean().exec()

    if(duplicate){

        return res.status(400).json({message: "Alreday registered"})
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const newVolunteer = new User({username, userId, password: hashedPwd})

    await newVolunteer.save()

    //data.newVolunteer in front from queryFulfilled or unwrap()
    res.json({newVolunteer})
})


//only admin can getAllVolunteers - exclude role: ADMIN
const getAllVolunteers = asyncHandler(async(req,res)=>{


    const volunteers = await User.find({role: {$eq: ROLES.VOLUNTEER}}).lean().select(['-password', '-__v']).exec()

    if(!volunteers?.length){
        return res.status(400).json({message: "No volunteers exist"})

    }

    //an arry of volunteers obj || {volunteers}
    res.json(volunteers)

    
})

//update volunteer e.g. username, and password with PUT
const updateVolunteer = asyncHandler(async(req,res)=>{

    const {username, password, id } = req.body

    //password change is optional
    if(requiredInputChecker({username, id})){

        return res.status(400).json({message: "All fields required"})

    }

    // const existingUser = await User.findOne({userId}).exec()
    const existingUser = await User.findById(id).exec()

    if(!existingUser){

        return res.status(400).json({message: "User DNE for PUT update"})
    }

    //change name for valid user
    const duplicateUserName = await User.findOne({username}).lean().exec()

    if(duplicateUserName && duplicateUserName?._id.toString() !==
    //  existingUser._id

    //using _id from req.body
        id
     ){

        return res.status(400).json({message: "Username already exists for change"})
    }



    if(password){

        const newHashedPwd = await bcrypt.hash(password, 10)
        existingUser.password = newHashedPwd
    }

    existingUser.username = username

    const updatedVolunteer =  await existingUser.save()

    //NOt this
    // const updatedVolunteer =  await existingUser.updateOne()

    res.json({updatedVolunteer})


})


//update events of each volunteer - volunteer signup PATCH
// const updateSignedUpEvents = asyncHandler(async(req,res)=>{

//     const { volunteerId, eventId } = req.body

//     //password change is optional
//     if(requiredInputChecker(req.body)){

//         return res.status(400).json({message: "All field(s) required"})

//     }

//     const existingUser = await User.findById(volunteerId).select('-password').exec()

//     if(!existingUser){

//         return res.status(400).json({message: "User DNE for PATCH update"})
//     }
//     const existingEvent = await Event.findById(eventId).exec()

//     if(!existingEvent){
//         return res.status(400).json({message: "Event DNE for PATCH update"})
//     }
    
//     //canNOT add the same event twice

//     //can tweak this into ternary operation BUT consider the res.json at the end
//     if(existingUser.signedUpEvents.includes(eventId)){
//         return res.status(400).json({message: "ALready signed up for event - go explore more opport!"})

//     }
    
//     //===0
//     if(!existingEvent.openPositions){
//         return res.status(400).json({message: "All positons filled up!"})

//     }

//     existingUser.signedUpEvents.push(existingEvent._id)

//     existingEvent.openPositions -= 1

//     existingEvent.eventVolunteers.push(existingUser._id)

//     await existingEvent.save()

//     const volunteerWithAddedEvent = await existingUser.save()

//     //ltr jsut res the added Event
//     res.json({volunteerWithAddedEvent})


// })

//model changes  - updateSignedUpShifts 
const updateSignedUpShifts = asyncHandler(async(req,res)=>{

    const {userId, eventId, shiftId} = req.body

    const existingUser = await User.findById(userId).select('-password').exec()
    const existingEvent = await Event.findById(eventId).exec()

    const existingShift = existingEvent.shifts.find(shift => (shift._id.toString() === shiftId ))

    

    if(!existingUser){

        return res.status(400).json({message: "User DNE for PATCH update"})
    }
    if(!existingEvent){
        return res.status(400).json({message: "Event DNE for PATCH update"})
    }

    if(!existingShift){
        return res.status(400).json({message: "SHIFT in event DNE for PATCH update"})

    }

    if(existingUser.signedUpShifts.includes(existingShift._id)){

        return res.status(400).json({message: "ALready signed up for event SHIFT - go explore more opport!"})

    }

    if(
        // !existingEvent.openPositions
     !existingShift.shiftPositions
    ){

        if(       !existingEvent.openPositions){
            return res.status(400).json({message: "all event positons filled up! "})

        }

        
        return res.status(400).json({message: "All shift positons filled up! Try other shifts"})

    }

    

    existingUser.signedUpShifts.push(shiftId)

    existingShift.shiftPositions -= 1

    // existingEvent.signedUpVolunteers.push({volunId: userId, shiftId})

    existingShift.signedUpVolunteers.push(userId)

    const updatedEvent = await existingEvent.save()
    const updatedUser = await existingUser.save()

    res.json({updatedEvent, updatedUser})
})
//search volun  - ltr: exclude ADMIN
const searchVolunteers = asyncHandler(async(req,res)=>{

    // /search/?q=:query
    const {q} = req.query

    //this only returns exact matches
    // const allEvents = await Event.find({eventName: {$in: q}})

    const allVolunteers = await User.find().lean().select('-password')

    const matchingVolunteers = allVolunteers.filter(volun => 


        //lowercase AND remove space for both search term and the searched

        toLowerNoSpace(volun.username).includes(toLowerNoSpace(q))

    )
    res.json({searchTerm: q, matchingVolunteers})




})


//sort users az
const sortVolunteersAlphabetically = asyncHandler(async(req, res)=> {

    const allSortedVolun = await User.find({role: {$eq: ROLES.VOLUNTEER}}).select(['-password', '-__v']).exec()
    
    
    .then(voluns => (

        sortOrder(voluns, 'username', true)
        // sortOrder(voluns, SORT_OBJECT.AZ.sortIndex,true)
    ))
    
    res.json({allSortedVolun})

})

//refresh signedUpEvents ids - auto Patch 
// const refreshSignedUpEvents = asyncHandler(async(req, res)=> {

//     const allEventsIds = await Event.find().lean()

//         .then(events => (

//             events.map(event => (
//                 event._id.toString()
//             ))
//         ))

//     const allVolunteers = await User.find({role: {$eq: ROLES.VOLUNTEER}}).  select(['-password', '-__v']).exec()
         
//     for(let i = 0; i<allVolunteers.length; i++){

//         const volun = allVolunteers[i]

//         const signedUpEvents = volun.signedUpEvents

//         for(let j=0; j<signedUpEvents.length; j++){

//             const eventId = signedUpEvents[j].toString()

//             if(!allEventsIds.includes(eventId)){

               

//                 //chking
//                 console.log('found: ', eventId, "new arr's length: ", signedUpEvents.length);

//                 signedUpEvents.splice(signedUpEvents.indexOf(eventId), 1)

//                 j = j-1

//                 await volun.save()
//             }
//         }
//     }
    
//     res.json({allEventsIds, allVolunteers})
// })

//chk w event.localDate if signedUpEvents is valid or not
const sortVolunteersByEventsCount = asyncHandler(async(req, res)=> {




   const countObj = {}

    const currentDate = new Date(Date.now())
    
    const allVolunteers = await User.find({role: {$eq: ROLES.VOLUNTEER}}).select(['-password', '-__v']).exec()


    for(let i = 0; i<allVolunteers.length; i++){

        const volun = allVolunteers[i]

        const signedUpEvents = volun.signedUpEvents

        let volunteeredCount = 0
        for(let j=0; j<signedUpEvents.length; j++){

            const eventId = signedUpEvents[j]

            const event= await Event.findById(eventId).exec()

            const convertedLocalEventDate = new Date(event.localEventDate)
        
            if(isBefore(convertedLocalEventDate, currentDate)){

                volunteeredCount++
                
                console.log('event alr done by ', volun.username);
                // countMap.set(volun._id, volunteeredCount )
                // countObj.se

                const isPropAlrExists = objKeysIncludes(countObj, volun._id)

                if(isPropAlrExists){

  
                      countObj = {...countObj, [volun._id]: volunteeredCount}
                    // proppedCountObj[volun._id] = volunteeredCount
                }

                else{
                            //if prop alr exists, the val is replaced aft incrementing
                     countObj[volun._id] = volunteeredCount
                }
      

                
                // countObj.id = volun._id
                // countObj.count = volunteeredCount
            }
        
            else if(isAfter(convertedLocalEventDate, currentDate)){
            
                 console.log('event Not yet ', volun.username);
            
            }
        }
    }


console.log('currentDate', currentDate);

const proppedCountObjArr = Object.entries(countObj).map(([id, count])=> {

    return {id: id, count: count}
})

const sortedCountObjArr = sortOrder(proppedCountObjArr, "count", false)

    res.json({
        // countMap:[ ...countMap.entries()],
        countObj,
    
         currentDate, 
       
        proppedCountObjArr,
        sortedCountObjArr
    })
})

const updateVolunteeredShifts = asyncHandler(async(req,res)=>{

    
    const nowDate = new Date(Date.now())

    const allEventsWithShifts = await Event.find().select(["_id", "shifts"]).exec()
        .then(events => 
                events.map(event => (

                     {
                        eventId: event._id,
                        eventShifts: event.shifts.map(shift => shift._id)
                     }
                    
                )
    ))

    const allVolunteers = await User.find().select(['-password']).exec()


    for(let i = 0; i< allVolunteers.length; i++){

        const currentVolun = allVolunteers[i]
        const signedUpShifts = currentVolun.signedUpShifts

        for(let j = 0; j<signedUpShifts.length; j++){

            const currentSignedUpShift = signedUpShifts[j]

            for(let k = 0; k<allEventsWithShifts.length; k++){

                const currentEvent = allEventsWithShifts[k]
                const currentEventId = currentEvent.eventId

                const includedShiftId = currentEvent.eventShifts.find(shift => shift.toString() === currentSignedUpShift.toString())

                if(currentVolun.volunteeredShifts.includes(includedShiftId)){

                    continue
                }

                if(includedShiftId){
                    console.log(includedShiftId, " included in event ", currentEventId);

                    const event = await Event.findById(currentEventId)
                    const shiftInfo = event.shifts.find(shift => shift._id.toString() === currentSignedUpShift.toString())

                    // console.log("End time of shift: ", shiftInfo.shiftEnd,  nowDate)
                    // console.log( "  local end: ", shiftInfo.localShiftEnd);

                    if(isBefore(shiftInfo.shiftEnd, nowDate)){

                        console.log('successfully volunteered in shift - add to volunteeredEvent');
                        currentVolun.volunteeredShifts.push(includedShiftId)

                        await currentVolun.save()
                    }
                    // else{
        
                    //     console.log('only signed up, NOT yet completed ', shiftInfo.shiftEnd, nowDate);
                    // }

                }
               
            }
        }
    }

    const extractedPropVolunteers = allVolunteers.map(volun => (objPropExtractor([ 'volunteeredShifts', '_id'], volun.toObject())))

    // extractedPropVolunteers.map(e => console.log(e._id))
    res.json({allEventsWithShifts, extractedPropVolunteers})
})


const sortVolunteersByShiftsCount = asyncHandler(async(req,res)=> {

    
})
module.exports = {
    createNewVolunteer,
    getAllVolunteers,
    updateVolunteer,

    updateSignedUpShifts,

    searchVolunteers,

    sortVolunteersAlphabetically,
    sortVolunteersByEventsCount,

    sortVolunteersByShiftsCount,
    // refreshSignedUpEvents,

    updateVolunteeredShifts

};
