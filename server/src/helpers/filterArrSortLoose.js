
// 100% loose filter sort

const filterArrSortLoose = (twoDArr)=> {

    if(    !Array.isArray(twoDArr)    ){
        throw new Error('Arr to be filtered but MUST be a 2d arr, even for loose filter')
    }

    if(!twoDArr.every(arr => Array.isArray(arr))){
        throw new Error('each elem must be an arr - an arr of arr')
    }

          //turn 2d arr into 1d 
    // let oneDArr = []
    // twoDArr.map(arr =>  {

    //         // [...oneDArr, ...arr]
            
    //      oneDArr = oneDArr.concat(arr)
    // })



    //wrg - flatMap(arr => [arr])
    let oneDArr = twoDArr.flatMap(arr => arr)

    // let oneDArr = twoDArr.flatMap(arr =>{

    //     if(!arr.length){
    //         console.log("empty arr");
    //     }

    //     return arr
    // })

   console.log('all ids (oneDArr) from loose filter: ', oneDArr);

    //filter algo with includes
     let matchIds = []
     oneDArr.map(id => {


        if(!matchIds.includes(id)){

            matchIds.push(id)
        }

    

    })

    console.log('matchIds from loose filter: ', matchIds);
    return matchIds
}

module.exports = filterArrSortLoose;
