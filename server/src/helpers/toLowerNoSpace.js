
//converts string obj to lowercase and remove space for search term 


const toLowerNoSpace = (word) => {


    // if(typeof word !== 'string'){

    //     throw new Error('Word is NOT a string')
    // }
    const convertedWord = word.toLowerCase().replace(/\s+/g, '')

    return convertedWord
}

module.exports = toLowerNoSpace;
