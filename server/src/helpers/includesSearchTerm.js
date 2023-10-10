const toLowerNoSpace = require("./toLowerNoSpace");

const includesSearchTerm = (searchIndex, searchTerm) => {
  
   
    if(typeof searchIndex !== 'string' || typeof searchTerm !== 'string' ){

        //alt
//    if (! [searchIndex, searchTerm].every(e => (typeof e === 'string'))){

        throw new Error('Search Index OR seach term not a string')
   }

   return toLowerNoSpace(searchIndex).includes(toLowerNoSpace(searchTerm)) ?
        true
        :
        false

}

module.exports =  includesSearchTerm;


