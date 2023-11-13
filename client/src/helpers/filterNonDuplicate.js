//same algo in back
//@desc makes an array with non-duplicates
//must be an array of strings

const filterNonDuplicate = (arr) => {

    if(!Array.isArray(arr)){
        throw new Error('arr param must be an arr')
    }

    if(arr.some((elem) =>( typeof elem !== 'string'))){
        throw new Error('arr param must be an array of strings')
    }
    
    let resultArr = []
    
    arr.map(elem => {

        if(!resultArr.includes(elem)){
            resultArr.push(elem)
        }
    })

    return resultArr

  
}

export default filterNonDuplicate