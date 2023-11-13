import React, { useState} from 'react'
import { useLazyPostFilteredEventsQuery } from '../eventsApiSlice';
import { useNavigate } from 'react-router';
import { Button, Form, } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import format from 'date-fns/format';
import "react-datepicker/dist/react-datepicker.css";
import findingQueryTypes from '../../../config/findingQueryTypes';

const EventFilter = ({setFindingQuery}) => {


    const [isOpen, setIsOpenFilter] = useState(false);
    const [isUpcoming, setIsUpcomingFilter] = useState(false);
    const [venue, setVenueFilter] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [date, setDateFilter] = useState("");


    const [filterEvents, {isLoading}] = useLazyPostFilteredEventsQuery()
    const navigate = useNavigate()

    const onVenueFilterChange = (e) => setVenueFilter( e.target.value)
    const onIsOpenFilterChange = (e) => setIsOpenFilter(prev => !prev)
    const onIsUpcomingFilterChange = (e) => setIsUpcomingFilter(prev => !prev)
  
    const canFilter = [isOpen, isUpcoming, venue, date].some(Boolean)  && !isLoading

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

            <Form.Label>Date Filter</Form.Label>

            <DatePicker className='mx-2'
                    
                    isClearable={true}
                    showIcon={true}
                    selected={selectedDate} 
                    onChange={date => {

                        if(!date) {
                            setDateFilter('')
                            setSelectedDate(date)
                            return
                        }
                        const formattedlocalDate = format(date, 'yyyy-MM-dd')
                        console.log('formattedlocalDate: ', formattedlocalDate);

                        setDateFilter(formattedlocalDate)
                        setSelectedDate(date)
                    }} 
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    placeholderText="Select a date"
                    
                
                    
                 />
    </Form.Group>
          
        
       
    )


    const handleFilterSubmit = async () => {

        if(!canFilter){
            return 
        }
        // let filterKeysObj = {}

        // const filterKeysArr = [venue, isOpen, isUpcoming, date]

        // filterKeysArr.map((filterKey) => {

        //     if(filterKey){

        //         let filterKeyStr = filterKey.toString()

        //         if(typeof filterKey === 'boolean'){
        //             console.log('filterKey is boolean: ', filterKey);
        //             filterKeyStr = Object.keys({filterKey}).pop()
        //         }
        //         Object.assign(filterKeysObj, {[filterKeyStr]: filterKey})
                
        //     }

        // })

        //obj appch cuz js arr is non-associative
        const filterKeysObj = {venue, isOpen, isUpcoming, date}

        Object.entries(filterKeysObj).map(([propKey, propVal])=> {

            //either true or empty string
            if(!propVal){
                delete filterKeysObj[propKey]
            }
        })

        
        console.log('filterKeysObj: ', filterKeysObj);
        
        try {
   

            const preferCacheValue = false
            await filterEvents(filterKeysObj, preferCacheValue).unwrap()

            navigate('/dash/events/filter')
            setFindingQuery((prev) => ({
                ...prev,
                findingQueryType: findingQueryTypes.FILTER,
                findingQueryVal: filterKeysObj,
              }));
        } catch (error) {
            console.log("Events Filter error: ", error);
        }

    }

   const filterSubmitButton = (

    <Button onClick={handleFilterSubmit} >Search With Filter</Button>
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