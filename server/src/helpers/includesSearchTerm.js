/**
 * checks if a search body includes a search term
 *
 * @param {string} searchIndex - The search index
 * @param {string} searchTerm - The search term
 * @returns {boolean} True if the search index includes the search term, false otherwise
 * @throws {Error} If searchIndex or searchTerm is not a string
 */
const includesSearchTerm = (searchIndex, searchTerm) => {
        if (typeof searchIndex !== "string" || typeof searchTerm !== "string") {
          throw new Error("Search Index OR search term not a string");
        }
      
        return searchIndex.toLowerCase().includes(searchTerm.toLowerCase());
      };
      
      module.exports = includesSearchTerm;