
//converts string obj to lowercase and remove space for search term 


const toLowerNoSpace = (word) => {


  
    const convertedWord = word.toLowerCase().replace(/\s+/g, '')

    return convertedWord
}

module.exports = toLowerNoSpace;
