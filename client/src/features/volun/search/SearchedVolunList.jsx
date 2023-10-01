import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchedVolunteers } from '../volunteersSlice'
import SingleVolunteerExcerpt from '../SingleVolunteerExcerpt'

const SearchedVolunList = () => {

    const volunteers = useSelector(selectSearchedVolunteers)

    // console.log('volunteers useSelector: ', volunteers);

    const content = volunteers.map(volun => {

        const volunId = volun.volunId
        return <SingleVolunteerExcerpt key={volunId} volunId={volunId}/>
})


  return content
}

export default SearchedVolunList