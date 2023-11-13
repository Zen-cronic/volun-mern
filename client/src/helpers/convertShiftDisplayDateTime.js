
const convertShiftDisplayDateTime = (dateTime) => {


    if(typeof dateTime !== 'string'){
        throw new Error('dateTime must be a string')
    }

    const dateTimeStrRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]{3}$/ 
    const isDateTimeStr = dateTimeStrRegex.test(dateTime)

    if(!isDateTimeStr){
        throw new Error('date must be in the format yyyy-MM-dd HH:mm:ss ZZZ')
    }

    const convertedDateTime = new Date(dateTime).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })

    return convertedDateTime
}

export default convertShiftDisplayDateTime