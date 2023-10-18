import React from 'react'

//@param format: 'yyyy-MM-dd'
//@desc local date string to UTC date string with the same date

const convertLocalDateToSameDateUTC = (localDateString) => {

    //regex test for localDateString
    const localDateRegex = /^\d{4}-\d{2}-\d{2}$/
    const isLocalDateStr = localDateRegex.test(localDateString)

    if(typeof localDateString !== 'string'){

        throw new Error('localDateString must be a string')
    }

    if(!isLocalDateStr){
        throw new Error('localDateString must be in the format yyyy-MM-dd')
    }


    const extractedLocalDD = localDateString.split('-')[2]

    const numberDD = parseInt(extractedLocalDD)

    const date = new Date(localDateString)
    date.setDate(numberDD)

    //setDate return a number
  return date
}

export default convertLocalDateToSameDateUTC