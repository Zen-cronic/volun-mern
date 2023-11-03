
const capitalizeFirstLetter = (word) => {

    if (typeof word !== "string") {
        throw new Error("word to capitalize must be a string");
      }
  
      if (word.length === 1) {
        return word.toUpperCase();
      }
  
      const lowerCasedWord = word.toLowerCase();
      const firstLetter = lowerCasedWord.charAt(0).toUpperCase();
  
      const remainingPart = lowerCasedWord.slice(1, word.length);
  
      const result = firstLetter.concat(remainingPart);
  
      return result;
}

export default capitalizeFirstLetter