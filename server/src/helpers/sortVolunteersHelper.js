const { ROLES } = require("../config/roles");
const { SORT_OBJECT } = require("../config/sortOptions");
const User = require("../models/User");
const sortOrder = require("./sortOrder");

const sortVolunteersHelper = async(sortOption,orderBool) => {


   const sortOptionObj = Object.values(SORT_OBJECT).find(opt => (opt.sortOption === sortOption))
  
   if(!sortOptionObj){
    throw new Error('sortOptionObj must be found to get its sortIndex - volunteerrsHelper')
   }

   const {sortIndex} = sortOptionObj
   //want descending order
   if(sortOption === SORT_OBJECT.HOURS.sortOption){
    orderBool = false
    }


    const allSortedVolunteers = await User
        .find({role: {$eq: ROLES.VOLUNTEER}})
        .select({password: 0, __v: 0})
        .lean()
        .exec()

        .then(volunteers => (


            sortOrder(volunteers, sortIndex, orderBool)
    ))
    
    return allSortedVolunteers

}

module.exports = sortVolunteersHelper;
