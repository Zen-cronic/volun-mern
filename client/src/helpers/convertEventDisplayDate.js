
const convertEventDisplayDate = (date) => {


    if(typeof date !== 'string'){
        throw new Error('date must be a string')
    }

    const dateStrRegex = /^\d{4}-\d{2}-\d{2}T00:00$/
    const isDateStr = dateStrRegex.test(date)

    if(!isDateStr){
        throw new Error('date must be in the format yyyy-MM-ddT00:00')
    }

    const convertedDate = new Date(date).toLocaleDateString('en-US', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})

    return convertedDate
}

export default convertEventDisplayDate