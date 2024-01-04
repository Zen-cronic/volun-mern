const removeElemObjIdArray = (origArr, checked)=>{

    if(typeof checked !== 'string'){

        throw new Error('the checekd vari from removeElemObjIdArray must be a string')
    }

    if(!Array.isArray(origArr)){

        throw new Error('msut be an arr for checking')
    }

    const resultArr = origArr.filter(elem => elem.toString() !== checked)

    return resultArr
}

module.exports = removeElemObjIdArray;
