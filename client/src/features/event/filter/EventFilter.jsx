import React, { useState, useEffect } from 'react'
import { useLazyPostFilteredEventsQuery } from '../eventsApiSlice';
import { useNavigate } from 'react-router';
import { Button, Form, } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import format from 'date-fns/format';
import "react-datepicker/dist/react-datepicker.css";

const EventFilter = () => {


    const [isOpen, setIsOpenFilter] = useState(false);
    const [isUpcoming, setIsUpcomingFilter] = useState(false);
    const [venue, setVenueFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [date, setDateFilter] = useState("");


    const [filterEvents] = useLazyPostFilteredEventsQuery()
    const navigate = useNavigate()

    const onVenueFilterChange = (e) => setVenueFilter( e.target.value)
    const onIsOpenFilterChange = (e) => setIsOpenFilter(prev => !prev)
    const onIsUpcomingFilterChange = (e) => setIsUpcomingFilter(prev => !prev)
  
    // const onDateFilterChange = (date) => {

    //     // console.log('date: ', date);
    //     setDateFilter(date)
        
    //     console.log('date: ', date);

    // }

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

    const datePicker = (

        
        <Form.Group className='my-1' >

            <Form.Label
            //  htmlFor="dateFilter"
            >Date Filter</Form.Label>
            {/* <Form.Control id='dateFilter'
                type='text'
                value={date}
                as={DatePicker}
                
            /> */}
            <DatePicker className='mx-2'
                    
                    showIcon={true}
                    selected={selectedDate} 
                    onChange={date => {

                        const formattedlocalDate = format(date, 'yyyy-MM-dd')
                        console.log('formattedlocalDate: ', formattedlocalDate);

                        setDateFilter(formattedlocalDate)
                        setSelectedDate(date)
                    }} 
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    placeholderText="Select a date"
                    
                    ariaDescribedBy="dateFilter"
                    ariaLabelledBy="dateFilter"
                    
                 />
    </Form.Group>
          
        
       
    )

    const handleFilterSubmit = async () => {

        try {
   

            const preferCacheValue = false
            await filterEvents({venue, isOpen, isUpcoming, date}, preferCacheValue).unwrap()

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
        {datePicker}
        {filterSubmitButton}

    </>
  )
}

export default EventFilter