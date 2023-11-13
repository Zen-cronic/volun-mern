
const isValidNumberInput = (input) => {

    if(typeof input !== 'string') {

        throw new Error('number input should be a string')
    }

    if(input.trim() === '') {
        console.log('input is empty string');
        return false
    }
        

   if(input === '0'){
         console.log('input is 0');
         return false
   }

   console.log('input isValidNumberInput: ', input);

   return !isNaN(input)
        
 
}

export default isValidNumberInput