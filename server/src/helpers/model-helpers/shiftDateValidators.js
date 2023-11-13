const { isBefore } = require("date-fns")
const dateObjChecker = require("../../errorHandlers/dateObjChecker")


const includedTimeInDate = (dateObj) => {
  

    // if(!(dateObjChecker(dateObj))){

    //     throw new Error('dateObj for chking must be a Date')


    // }
    if(!dateObjChecker(dateObj)){
        return false
    }


    //meaning ...T00:...
    //getUTC vs get
    if(
        dateObj.getHours() === 0 &&
     dateObj.getMinutes() ===0){
        return false
    }

    return true
}



const sameDateShift = (shiftStart, shiftEnd) => {
  

   
    const areDateObjs = dateObjChecker(shiftStart) && dateObjChecker(shiftEnd)
    if(!areDateObjs)
        return null

    if(shiftStart.getDate() !== shiftEnd.getDate() ){
        return false
    }

    return true
}

const shiftStartIsBefore = (shiftStart, shiftEnd) => {

    const areDateObjs = dateObjChecker(shiftStart) && dateObjChecker(shiftEnd)
    if(!areDateObjs)
        return null


    return isBefore(shiftStart, shiftEnd)
}

const validateShiftTime = (shiftStart, shiftEnd) => {

    
    const areDateObjs = dateObjChecker(shiftStart) && dateObjChecker(shiftEnd)
    if(!areDateObjs)
        return null


    if(![shiftStart, shiftEnd].every(minutes => (minutes.getMinutes() === 0 || minutes.getMinutes() === 30 ))){

        
        return false
    }

    // if(shiftStart.getMinutes() !== 0 && shiftStart.getMinutes() !== 30 ){
    //     validated = false
    // }

    return true
}


module.exports = {
    includedTimeInDate,
    sameDateShift,
    shiftStartIsBefore,
    validateShiftTime,

};
