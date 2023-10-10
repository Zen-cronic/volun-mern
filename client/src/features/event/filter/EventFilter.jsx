import React, { useState, useEffect } from 'react'
import { useLazyPostFilteredEventsQuery } from '../eventsApiSlice';
import { useNavigate } from 'react-router';
import { Button, Form, } from 'react-bootstrap';

const EventFilter = () => {


    const [isOpen, setIsOpenFilter] = useState(false);
    const [isUpcoming, setIsUpcomingFilter] = useState(false);
    const [venue, setVenueFilter] = useState('');


    const [filterEvents] = useLazyPostFilteredEventsQuery()
    const navigate = useNavigate()

    const onVenueFilterChange = (e) => setVenueFilter( e.target.value)
    const onIsOpenFilterChange = (e) => setIsOpenFilter(prev => !prev)
    const onIsUpcomingFilterChange = (e) => setIsUpcomingFilter(prev => !prev)

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
    const isUpcomingButton = (

        <Form.Group controlId='isUpcomingFilter' className=' my-1 '>
            
          <Form.Check
            type='checkbox'
            onChange={onIsUpcomingFilterChange}    
            checked={isUpcoming}
            label='Is Upcoming events/shifts only'
            >
             
            </Form.Check>

        </Form.Group>
      
        
    )

    const handleFilterSubmit = async () => {

        try {
   

            const preferCacheValue = false
            await filterEvents({venue, isOpen, isUpcoming}, preferCacheValue).unwrap()

            navigate('/dash/events/filter')

        } catch (error) {
            console.log("Events Filter error: ", error);
        }

    }
   const filterSubmitButton = (

    <Button onClick={handleFilterSubmit}>Search With Filter</Button>
   )


   

  return (
    <>

        {venueOptionsSelect}
        {isOpenButton}
        {isUpcomingButton}
        {filterSubmitButton}

    </>
  )
}

export default EventFilter