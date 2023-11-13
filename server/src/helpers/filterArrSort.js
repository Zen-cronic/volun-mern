
//at least 2 occurence

const filterTwoDArrSort  = (filterTwoDArr)=>{

    // !.isArray()
    if(    !Array.isArray(filterTwoDArr)    ){
        throw new Error('Arr to be filtered but MUST be a 2d arr')
    }

    // console.table(filterTwoDArr)

    let matchIds = []

    for (let i = 0; i<filterTwoDArr.length-1 ; i++ ){
    
        for(let j = 0; j<filterTwoDArr[i].length ; j++){
    
            breakLabel:
            for(let n= i+1; n<filterTwoDArr.length  ; n++ ){

                for(let k=0; k<filterTwoDArr[n].length ; k++){
        
                    const current = filterTwoDArr[i][j]
 
                    if(matchIds.includes(current))
                        break breakLabel;

                    if( (current === filterTwoDArr[n][k] )
                        ){

             
                        matchIds.push(current)
                        // console.log('match: ', current );

                        break breakLabel;
                        // break
                    }
        

                }


            }
       

        }


    }

    return matchIds
}

module.exports = filterTwoDArrSort;
