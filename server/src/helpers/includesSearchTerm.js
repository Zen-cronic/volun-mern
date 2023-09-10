const toLowerNoSpace = require("./toLowerNoSpace");

const includesSearchTerm = (searchIndex, searchTerm) => {
  
    //can simplify to || !== string
    if(typeof searchIndex !== 'string' || typeof searchTerm !== 'string' ){

//    if (! [searchIndex, searchTerm].every(e => (typeof e === 'string'))){

        throw new Error('Search Index OR seach term not a string')
   }

   return toLowerNoSpace(searchIndex).includes(toLowerNoSpace(searchTerm)) ?
        true
        :
        false

}

module.exports =    includesSearchTerm;


