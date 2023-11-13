import React from 'react'
import { useSelector } from 'react-redux'
import { selectSearchedVolunteers } from '../volunteersSlice'
import SingleVolunteerExcerpt from '../SingleVolunteerExcerpt'
import VolunteersListLayout from '../VolunteersListLayout'

const SearchedVolunList = () => {

    const volunteers = useSelector(selectSearchedVolunteers)

    // console.log('volunteers useSelector: ', volunteers);

    const content = volunteers.map(volun => {

        const volunId = volun.volunId
        return (<tr key={volunId}>
        <SingleVolunteerExcerpt key={volunId} volunId={volunId} />
      </tr>)
})


  return (<VolunteersListLayout tableBodyContent={content}/>)
}

export default SearchedVolunList