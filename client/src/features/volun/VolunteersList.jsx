import React from 'react'
import { useGetAllVolunteersQuery } from './volunteersApiSlice'
import SingleVolunteerExcerpt from './SingleVolunteerExcerpt'

const VolunteersList = () => {

    const {data: volunteers, isSuccess: isVolunSuccess, isLoading, isError, error} = useGetAllVolunteersQuery('usersList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if(isVolunSuccess){

        const {ids} = volunteers
        console.log('all volunteers mongo ids from useQUery:', ids);
        content = ids.map((volunId) => (

            // <EventExcerpt key={eventId} eventId={eventId}/>
            <SingleVolunteerExcerpt key={volunId} volunId={volunId}/>
        ))
    }
  return content
}

export default VolunteersList