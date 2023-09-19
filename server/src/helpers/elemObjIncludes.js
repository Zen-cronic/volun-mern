
const elemObjIncludes = (arr, checked) => {


 
    if(!Array.isArray(arr)){

        throw new Error('elemObjIncludes param must be an arr')
    }

    const included = arr.find(obj => obj?.eventId === checked)

    if(included)    
        return true

    else{
        return false
    }
}

module.exports =  elemObjIncludes