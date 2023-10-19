

const objKeysIncludes = (obj, checked) => {



    if(!(obj instanceof Object)){
        throw new Error('Obj param must be an object')

    }

    
    // if(Object.keys(obj).some(key => (key === checked))){
    if(Object.keys(obj).includes(checked)){

        console.log('checked is alr included in keys (from objKeysIncludes), ' ,checked); 
        return true
    }
      

    return false
}

module.exports = objKeysIncludes;
