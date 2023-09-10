

const objKeysIncludes = (obj, checked) => {


    // if(!Array.isArray(objKeysArr)){

    //     throw new Error('Obj keys must be an array')

    // }

    if(!(obj instanceof Object)){
        throw new Error('Obj param must be an object')

    }

    if(Object.keys(obj).some(key => (key === checked))){

        console.log('checked is included in keys, ' ,checked);
        return true
    }
      

    return false
}

module.exports = objKeysIncludes;
