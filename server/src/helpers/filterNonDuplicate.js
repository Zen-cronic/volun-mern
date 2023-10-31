
//only for string and number
const filterNonDuplicate = (arr) =>{

  

    if(!Array.isArray(arr)){
        throw new Error('arr param must be an arr')
    }
    
    const resultArr = []
    
    arr.map(elem => {

        if(!resultArr.includes(elem)){
            resultArr.push(elem)
        }
    })

    return resultArr

  
}

module.exports = filterNonDuplicate;
