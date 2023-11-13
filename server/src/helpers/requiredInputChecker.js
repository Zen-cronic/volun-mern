
const requiredInputChecker = ( fieldsObj) =>{

   //val.toString() for Number and Date

    const isMissingFields = Object.values(fieldsObj).some(val => (

        
          !val ||
            //blank space condi - if (str.name.value.replace(/\s+/g, '').length == 0) {
            !val.toString().replace(/\s+/g, '')?.length 
        
 
    
        )

    )

    console.log("is it Missing Fields: ", isMissingFields)

    return isMissingFields //boolean - true if field(s) is missing
}

module.exports = requiredInputChecker