import React from 'react'
import { useSelector } from 'react-redux'
import { selectSortedVolunteers } from '../volunteersSlice'
import SingleVolunteerExcerpt from '../SingleVolunteerExcerpt'

const SortedVolunList = () => {

  const sortedVolunteers = useSelector(selectSortedVolunteers)

  let content 
  if(sortedVolunteers.length){
    content = sortedVolunteers.map(volun => {

      const volunId = volun.volunId 
      // const volunId =  volun._id
      return <SingleVolunteerExcerpt key={volunId} volunId={volunId}/>
    })
  }

  else{
    content = (<p>No voluns for sort</p>)
  }
  return content
}

export default SortedVolunList