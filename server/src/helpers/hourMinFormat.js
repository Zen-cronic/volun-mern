
//a Date obj into string with Date fx

const { TIME_ZONE } = require("../config/timeZones");

const hourMinFormat = () => {
  
   
    const bufferDate = new Date(TIME_ZONE.TORONTO.utcOffsetMs)

    const hours = bufferDate.getUTCHours()
    const minutes = bufferDate.getUTCMinutes()

    const formattedTime = "T" + hours.toString().padStart(2, '0') + ":" +
        minutes.toString().padStart(2, '0')

    return formattedTime 
}


module.exports = hourMinFormat;
