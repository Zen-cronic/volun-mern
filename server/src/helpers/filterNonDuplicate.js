

const filterNonDuplicate = (arr) =>{

  

    if(!Array.isArray(arr)){
        throw new Error('arr param must be an arr')
    }
    let resultArr = []
    
    arr.map(elem => {

        if(!resultArr.includes(elem)){
            resultArr.push(elem)
        }
    })

    return resultArr

  
}

module.exports = filterNonDuplicate;
