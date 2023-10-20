import React from 'react'

//@param format: 'yyyy-MM-ddT00:00'
//@desc local date string to UTC date string with the same date

const convertLocalDateToSameDateUTC = (localDateString) => {

    //regex test for localDateString

    const localDateRegex = /^\d{4}-\d{2}-\d{2}T00:00$/
    const isLocalDateStr = localDateRegex.test(localDateString)

    if(typeof localDateString !== 'string'){

        throw new Error('localDateString must be a string')
    }

    if(!isLocalDateStr){
        throw new Error('localDateString must be in the format yyyy-MM-dd')
    }


    const extractedLocalDD = localDateString.split('-')[2].replace('T00:00', '')

    const numberDD = parseInt(extractedLocalDD)

    // console.log('numberDD: ', numberDD, " | extractedLocadDD ", extractedLocalDD);

    const date = new Date(localDateString)
    date.setDate(numberDD)

    // console.log('setDate for DatePickerForm: ', date);  //as expected
    //setDate return a number
  return date
}

export default convertLocalDateToSameDateUTC