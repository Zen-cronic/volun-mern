import React, { useState, useEffect } from 'react'
import { useLazyPostFilteredEventsQuery } from '../eventsApiSlice';
import { useNavigate } from 'react-router';
import { Button, Form, } from 'react-bootstrap';

const EventFilter = () => {


    const [isOpen, setIsOpenFilter] = useState(false);
    const [venue, setVenueFilter] = useState('');

    // const {filterEvents, isLoading, isSuccess: isFilterSuccess, isError: isFilterError, error: filterError} = usePostFilteredEventsQuery

    const [filterEvents, {isLoading, isSuccess: isFilterSuccess, data: filteredEventsData }] = useLazyPostFilteredEventsQuery()
    const navigate = useNavigate()
    // useEffect(() => {

    //     if(isFilterSuccess){

    //         // setIsOpenFilter(prev => !prev)
    //         // setVenueFilter('')

    //         //filter route
    //         console.log('currentFilters: ', isOpen, venue);
    //         // navigate('/events/filter')

    //     }

    // }, [isFilterSuccess, navigate]);

    const onVenueFilterChange = (e) => setVenueFilter( e.target.value)
    const onIsOpenFilterChange = (e) => setIsOpenFilter(prev => !prev)

    const venueOptionsSelect = (

        <Form.Select value={venue} name='venueFilter' onChange={onVenueFilterChange}>
           
            <option value={''}> - Select Campus -</option>
            <option value={'Casa Loma'}>Casa Loma</option>
            <option value={'St James'}>St James</option>
            <option value={'Waterfront'}>Waterfront</option>
            <option value={'External'}>External</option>
            
        </Form.Select>
    )

    const isOpenButton = (

        <Form.Group controlId='isOpenFilter' className=' my-1 '>
            
          <Form.Check
            type='checkbox'
            onChange={onIsOpenFilterChange}    
            checked={isOpen}
            label='Is Open Positions Only'
            >
             
            </Form.Check>

        </Form.Group>
      
            
               
      
    )

    const handleFilterSubmit = async () => {

        try {
   

            const preferCacheValue = true
            // console.log('filterKeys obj: ', filterKeysObj);
            const {data} = await filterEvents({venue, isOpen}, preferCacheValue).unwrap()
            // const {data} = await filterEvents({...filterKeysObj})
            navigate('/dash/events/filter')

            console.log("Filtered events data: ", data);
        } catch (error) {
            console.log("Filter error: ", error);
        }

    }
   const filterSubmitButton = (

    <Button onClick={handleFilterSubmit}>Search With Filter</Button>
   )


   

  return (
    <>

        {venueOptionsSelect}
        {isOpenButton}
        {filterSubmitButton}

    </>
  )
}

export default EventFilter