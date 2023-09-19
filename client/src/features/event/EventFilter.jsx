import React, { useState, useEffect } from 'react'
import {usePostFilteredEventsMutation } from './eventsApiSlice';
import { useNavigate } from 'react-router';

const EventFilter = () => {


    const [isOpen, setIsOpenFilter] = useState(false);
    const [venue, setVenueFilter] = useState('');

    const [filterEvents, {isLoading, isSuccess: isFilterSuccess}] = usePostFilteredEventsMutation()

    const navigate = useNavigate()
    useEffect(() => {

        if(isFilterSuccess){

            setIsOpenFilter(prev => !prev)
            setVenueFilter('')

            //filter route
            navigate('/events/filtered')

        }

    }, [isFilterSuccess, navigate]);

    const onVenueFilterChange = (e) => setVenueFilter( e.target.value)
    const onIsOpenFilterChange = (e) => setIsOpenFilter(prev => !prev)

    const venueOptionsSelect = (

        <select value={venue} name='venueFilter' onChange={onVenueFilterChange}>
           
            <option value={''}></option>
            <option value={'Casa Loma'}>Casa Loma</option>
            <option value={'St James'}>St James</option>
            <option value={'Waterfront'}>Waterfront</option>
            <option value={'External'}>External</option>
            
        </select>
    )

    const isOpenButton = (

        <>
        <label>IS OPEN events only</label>
  <input type='checkbox'
            checked={isOpen}
            onChange={onIsOpenFilterChange}            
        />
        </>
      
    )

    const handleFilterSubmit = async (e) => {

        try {
            const {data} = await filterEvents({venue, isOpen})
            
            console.log("Filtered events data: ", data);
        } catch (error) {
            console.log("Filter error: ", error);
        }

    }
   const filterSubmitButton = (

    <button onClick={handleFilterSubmit}>Search With Filteres</button>
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