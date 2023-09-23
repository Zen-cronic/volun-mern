//either ascending or descending

const sortOrder = (sortArr, sortIndex, orderBool) => {

    

   
//sortArr is an arry of Documents/obj
    if(!Array.isArray(sortArr)){

        throw new Error('Sort Arr must be an array')
    }

    if(typeof sortIndex !== 'string'){

        throw new Error('Sort Index must be a string')
    }

    if(typeof orderBool !== 'boolean'){

        throw new Error('Sort val must be a boolean for either ascending or descending')
    }

   
    
    let sortedArr
    
    //ascending
    orderBool
    ?
    sortedArr = sortArr.sort((a,b) => {

        if (a[sortIndex]< b[sortIndex]) {
            return -1;
          } else if (a[sortIndex]> b[sortIndex] ) {
            return 1;
          }
          return 0;
        
    })

    :
    
    sortedArr = sortArr.sort((a,b) => {

        if (a[sortIndex]< b[sortIndex]) {
            return 1;
          } else if (a[sortIndex]> b[sortIndex] ) {
            return -1;
          }
          return 0;
        
    })

    return sortedArr
}

module.exports = sortOrder;
