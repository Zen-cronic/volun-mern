import React from 'react'
import { useGetAllVolunteersQuery } from './volunteersApiSlice'
import SingleVolunteerExcerpt from './SingleVolunteerExcerpt'
import VolunteersListLayout from './VolunteersListLayout'

const VolunteersList = () => {

    const {data: volunteers, isSuccess: isVolunSuccess, isLoading, isError, error} = useGetAllVolunteersQuery('usersList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let tableBodyContent

    if (isLoading) tableBodyContent = <p>Loading...</p>

    if (isError) {
        tableBodyContent = <p className="errmsg">{error?.data?.message}</p>
    }

    if(isVolunSuccess){

        const {ids} = volunteers

        tableBodyContent = ids.map((volunId) => (

            <tr key={volunId}>
                  <SingleVolunteerExcerpt key={volunId} volunId={volunId}/>
            </tr>
              
          ))
    }

    const content = (

        <VolunteersListLayout tableBodyContent={tableBodyContent}/>

      )
      
  return content
}

export default VolunteersList