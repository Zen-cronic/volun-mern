//instance of Object over Volun

const objPropExtractor = (keys, obj) => {

    if(!(obj instanceof Object)){
        throw new Error('msut be a Plain obj to extract from')
    }

    // console.log( obj instanceof Volun);

    if(!Array.isArray(keys)){
        console.log('is a single elemnt provided, turn into []');
        keys = [keys]
    }

    
    if(!keys.every(elem => (typeof elem === 'string'))){
        throw new Error('Each element in keys arr must be a string')
    }


    const propArr = Object.entries(obj).filter(([propKey, propVal])=> {


        if(keys.includes(propKey)){


            return {[propKey]: propVal}
        }
    })

    return Object.fromEntries(propArr)
}


module.exports = objPropExtractor;
