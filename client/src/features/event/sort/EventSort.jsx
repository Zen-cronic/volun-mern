import React, { useState } from 'react'
import { useLazyPostSortedEventsQuery } from '../eventsApiSlice';
import { useNavigate } from 'react-router';

const EventSort = () => {

    const [sortOption, setSortOption] = useState('');
    const [sortEvents] = useLazyPostSortedEventsQuery()
    const navigate = useNavigate()

    const onSortOptionsChange = (e) => setSortOption( e.target.value)

    const sortOptionsSelect = (

        <select value={sortOption} name='sortSelect' onChange={onSortOptionsChange}>
           
            <option value={''}></option>
            <option value={'soonest'}>Soonest (Excludes Past events)</option>
            <option value={'az'}>Alphabetically</option>
            <option value={'open'}>Open Positions</option>
            {/* <option value={'newest'}>External</option> */}
            
        </select>
    )

    const handleSortSubmit = async () => {

        try {
   

            const preferCacheValue = true
            // const {data} = await sortEvents({[sortOption]: true}, preferCacheValue)
            const {data} = await sortEvents(sortOption, preferCacheValue)
            navigate('/events/sort')

            console.log("Sorted events data: ", data);
        } catch (error) {
            console.log("Sort error: ", error);
        }

    }
   const sortSubmitButton = (

    <button onClick={handleSortSubmit}>Sort {sortOption}</button>
   )

  return (
    <>
        {sortOptionsSelect}
        {sortSubmitButton}
    </>
  )
}

export default EventSort