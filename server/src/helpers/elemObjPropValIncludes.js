
//e.g.
//[{eventId: checked}, {eventId: ...,}, {eventId:...}] = arr
// "eventId" = propKey
// checked.toString() = checked


const elemObjPropValIncludes = (arr, propKey, checkedPropVal) => {


 
    if(!Array.isArray(arr)){

        throw new Error('elemObjPropValIncludes arr param must be an arr')
    }

    if(typeof propKey !== 'string'){
        throw new Error('elemObjPropValIncludes propKey param must be an string')

    }

    //propKey must exists in all objs in the array
    if(arr.some(obj => (!Object.hasOwn(obj,propKey)))){

        throw new Error(`all elem obj in the arr must contain propKey: ${propKey} : as a property key`)
    }


    const included = arr.findIndex(obj => obj[propKey].toString() === checkedPropVal.toString())

    return included
}

module.exports =  elemObjPropValIncludes