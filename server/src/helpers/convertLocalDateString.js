const  {formatInTimeZone }=require('date-fns-tz')
const {TIME_ZONE} = require('../config/timeZones')

//a Date obj into string with date-fns 

const convertLocalDateString = (date) => {
  
    if(!(date instanceof Date)){

        throw new Error('a Non-Date cannot be convereted to a String - date event filter')
    }
    const localDate = formatInTimeZone(date, TIME_ZONE.TORONTO.timeZone,   'yyyy-MM-dd HH:mm:ss zzz')

    return localDate
}

module.exports = convertLocalDateString;
