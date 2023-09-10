const dateObjChecker = require("../../errorHandlers/dateObjChecker")

const calculateShiftDuration  = (shiftStart, shiftEnd) => {

    const areDateObjs = dateObjChecker(shiftStart) && dateObjChecker(shiftEnd)
    if(!areDateObjs)
        return null

        //both in UTC
    console.log("from calculate shift duration: ",shiftStart, shiftEnd);


    const shiftDuration = (shiftEnd.getTime() - shiftStart.getTime())/ (1000 *60 *60)
   
    console.log("Shift duration hours with getTime: ", shiftDuration );
    return shiftDuration



}

module.exports = calculateShiftDuration;
