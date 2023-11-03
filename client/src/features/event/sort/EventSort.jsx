import React, { useState } from 'react'
import { useLazyPostSortedEventsQuery } from '../eventsApiSlice';
import { useNavigate } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import findingQueryTypes from '../../../config/findingQueryTypes';

const EventSort = ({setVal}) => {

    const [sortOption, setSortOption] = useState('');
    const [sortEvents] = useLazyPostSortedEventsQuery()
    const navigate = useNavigate()

    const onSortOptionsChange = (e) => setSortOption( e.target.value)

    const sortOptionsSelect = (

        <Form.Select value={sortOption} name='sortSelect' onChange={onSortOptionsChange}>
           
            <option value={''}></option>
            <option value={'soonest'}>Soonest (Excludes Past events)</option>
            <option value={'event_az'}>Alphabetically</option>
            <option value={'open'}>Open Positions</option>
            {/* <option value={'newest'}>External</option> */}
            
        </Form.Select>
    )

    const handleSortSubmit = async () => {

        try {
   

            const preferCacheValue = true
            // const {data} = await sortEvents({[sortOption]: true}, preferCacheValue)
            const {data} = await sortEvents(sortOption, preferCacheValue)
            navigate('/dash/events/sort')

            // setVal(sortOption)
            setVal((prev) => ({
                ...prev,
                findingQueryType: findingQueryTypes.SORT,
                findingQueryVal: sortOption,
              }));
            console.log("Sorted events data: ", data);
        } catch (error) {
            console.log("Sort error: ", error);
        }

    }
   const sortSubmitButton = (

    <Button onClick={handleSortSubmit}>Sort {sortOption}</Button>
   )

  return (
    <>
        {sortOptionsSelect}
        {sortSubmitButton}
    </>
  )
}

export default EventSort