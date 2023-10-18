import React, { useState, useEffect } from 'react'
import AddEventDateAndShiftTime from './AddEventDateAndShiftTime'

import { toast } from 'react-toastify'
import { useNavigate, useParams} from 'react-router-dom'
import isValidNumberInput from '../../../helpers/isValidNumberInput'
import { Container, Row, Form, Stack, Col, FloatingLabel,Button, } from 'react-bootstrap'
import { useUpdateEventInfoMutation } from '../eventsApiSlice'


//event obj from back - localEventDates+T00:00
const EditEventForm = ({event, eventId}) => {


    const [listId, setListId] = useState(1)
    const [shiftListId, setShiftListId] = useState(1*100)
  
    const navigate =useNavigate()

   
    const [formData, setFormData] = useState({
  
      eventName: "",
       eventVenue:"",
        eventDates: [], 
        eventDescription: "",
        shifts: [],
    })

    const [updateEventInfo, {isSuccess: isUpdateSuccess, isLoading: isUpdateLoading}] = useUpdateEventInfoMutation()

   //reformat data for front rendering 
   //local dates format from back using date-fns-tz format(): yyyy-MM-dd HH:mm TZ

    useEffect(() => {
      
      if(event){

        let initialListId = listId -1
       let initialShiftListId =  shiftListId -1

       const eventDatesWithListIdsAndDates = event.localEventDates.map(localEventDate => {

        // const listId = initialListId++
        initialListId++
        const date = localEventDate.split(' ')[0].concat('T00:00')

        return {
          listId : initialListId, 
          date
        }
        
       })

       
       //shfitListIds && parentListIdForShift
       const shiftsWithListIds = event.shifts.map(shift => {

          if(!Array.isArray(eventDatesWithListIdsAndDates)){
            throw new Error('Must be an arr for shiftsWithListIds')
          }

          const splitLocalShiftStart = shift.localShiftStart.split(' ')
          const splitLocalShiftEnd = shift.localShiftEnd.split(' ')

          //for finding correspodingEvent only
          const shiftStartDate = splitLocalShiftStart[0]

          //HH:mm format
          const shiftStartTime =splitLocalShiftStart[1].slice(0,5)
          const shiftEndTime = splitLocalShiftEnd[1].slice(0,5)

          

          initialShiftListId++

          //eventDateObj.date = date + T00:00
          const correspondingEvent = eventDatesWithListIdsAndDates.find(eventDateObj => eventDateObj.date.includes(shiftStartDate)
          )
        

          return {
          
            //to keep shiftId unchanged when sending submitting to back
            shiftId: shift._id,
            
            shiftListId: initialShiftListId,
            shiftStart: shiftStartTime,
            shiftEnd: shiftEndTime,
            shiftPositions: shift.shiftPositions.toString(), 
            parentListIdForShift: correspondingEvent.listId,
          }
       })

        setFormData({

          ...formData,
          eventName: event.eventName,
          eventVenue: event.eventVenue,
          eventDescription: event.eventDescription,
          eventDates: eventDatesWithListIdsAndDates,
          shifts: shiftsWithListIds
        })

        //only works with + 1
        setListId(initialListId +1)
        setShiftListId(initialShiftListId +1)

      }
    }, []);

    useEffect(() => {
      
    
      if(isUpdateSuccess){

        setFormData({
  
          eventName: '',
           eventVenue: '',
            eventDates: [], 
            eventDescription: '',
            shifts: []
        })

        toast.success('Event updated successfully')

        navigate('/dash/events')
      }

    }, [isUpdateSuccess, navigate]);

    //onClick addEventDateAndSHift, both eventDates and shifts changes
    const addEventDateAndShift = () => {

        setFormData({...formData, 
            eventDates: [...formData.eventDates, {
                listId: listId,
                date: ''
            }],
            shifts: [...formData.shifts, {
                shiftListId: shiftListId,
                shiftStart: '',
                shiftEnd: '',
                shiftPositions: '',
                 parentListIdForShift: listId 
            }]
        })

        console.log('addEventandShift & parentListIdForShift listID: ', listId, ' | shiftListId: ', shiftListId,)

        setListId(listId+1)
        setShiftListId(shiftListId+1)
 
    }

    const updateEvent =(eventDateObj) => {

      const updatedEventDates = formData.eventDates.map(eventDate => {

        if(eventDate.listId === eventDateObj.listId){
          return eventDateObj
        }

        //unmodified obj
        return eventDate
      })

      setFormData({...formData, eventDates: updatedEventDates})

     
    }

    const updateShift =(shiftObj) => {

      const updatedShiftTimes = formData.shifts.map(shift => {

        if(shiftObj.shiftListId === shift.shiftListId){
          return shiftObj
        }

        return shift
      })

      setFormData({...formData, shifts: updatedShiftTimes})

    }

    const removeEventAndShift= (eventDateObj) =>{

        console.log('tbremoved evetnDateObj: ',eventDateObj);
        if(formData.eventDates.length ===1){
            console.log('min 1 date/shift');
            return null
        }

        const updatedEventDates = formData.eventDates.filter(eventDate => eventDate.listId !== eventDateObj.listId)

        //[]remove shifts of that event too - for bcknd
        console.log('updatedShiftTimes w/o removing:  ',formData.shifts);
        
        const updatedShiftTimes = formData.shifts.filter(shift => shift.parentListIdForShift !== eventDateObj.listId)

        setFormData({...formData,
             
             eventDates: updatedEventDates,
            shifts:updatedShiftTimes})

          
    }



    const renderEventDatesAndShifts = formData.eventDates.map((eventDate) => {

      console.log('eventDate from renderEventDatesAndShifts: ', eventDate);

      const correspondingShift = formData.shifts.find(shift => shift.parentListIdForShift === eventDate.listId);

      //undefined correspondingShift 
      console.log('correspondingShift: ', correspondingShift);
    
      return (

  <AddEventDateAndShiftTime
    key={eventDate.listId} 
    
     listId={listId-1} 
        eventDate={eventDate} 
  
        removeEventAndShift={removeEventAndShift}
        updateEvent={updateEvent}
        updateShift={updateShift}
        shift={correspondingShift}
        shiftListId={shiftListId - 1}

        eventId={eventId}
    />
      )
       

})


   


   


 
    const handleFormSubmit = async(e) => {

        e.preventDefault()

        //mini input validation
        if(formData.shifts.some(shift => !isValidNumberInput(shift.shiftPositions))){

          
          toast.error('Please enter a valid number greater than 0 for shift positions')
          return
        
      }

       //data format for back
        const modifiedEventDatesOnly = formData.eventDates.map(eventDate => (eventDate.date))

        const modifiedShifts = formData.shifts.map(shift => {

              const correspondingEvent = formData.eventDates.find(eventDate=>   eventDate.listId === shift.parentListIdForShift)

            const shiftStart = correspondingEvent.date.replace('T00:00', 'T' + shift.shiftStart)
            const shiftEnd = correspondingEvent.date.replace('T00:00', 'T' + shift.shiftEnd)

              return {
                ...shift,
                shiftStart,
                shiftEnd,
                shiftPositions: Number(shift.shiftPositions)

              }

      
        })
        
   
        console.log('------------------');
        console.log('modified shifts for back: ', modifiedShifts);
        console.log('modified eventDatesOnly for back: ', modifiedEventDatesOnly);

        const formDataForBack = {...formData, eventDates: modifiedEventDatesOnly, shifts: modifiedShifts}
        console.log('formData from handleSubmitForm: ', formDataForBack);

      

        
        try {
            
            const updatedEvent = await updateEventInfo({...formDataForBack, eventId}).unwrap()


            console.log('updatedEvent from front ', updatedEvent);


        } catch (err) {
          toast.error('Error updating new event')
          console.error('error from updatedEventInfo: ',err);
        }
    }
    
    const createdAt = new Date(event.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    const updatedAt = new Date(event.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
  return (

    <Container>
      <Stack gap={3}>
        <Form>
          <h2>Event Form</h2>

          <FloatingLabel
            controlId='eventFormInput'
            label='Event Name'
            className="mb-3">
            
            <Form.Control 
              type='text'
              value={formData.eventName}
              onChange={e => setFormData({...formData, eventName: e.target.value})}
              placeholder='Enter event name'

            />
            </FloatingLabel>

      <FloatingLabel
            controlId='eventFormInput'
            label='Event Description'
            className="mb-3">
            
            <Form.Control 
              type='text'
              value={formData.eventDescription}
              onChange={e => setFormData({...formData, eventDescription: e.target.value})}
              placeholder='Enter event description'

            />

          </FloatingLabel>

       

          <FloatingLabel
            controlId='eventFormInput'
            label='Event Venue'
            className="mb-3">
            
              
            <Form.Select value={formData.eventVenue} name='venueFilter' onChange={e => setFormData({...formData, eventVenue: e.target.value})}>
              
                <option value={''}> - Select Campus -</option>
                <option value={'Casa Loma'}>Casa Loma</option>
                <option value={'St James'}>St James</option>
                <option value={'Waterfront'}>Waterfront</option>
                <option value={'External'}>External</option>
                
            </Form.Select>
            
    

          </FloatingLabel>

          

          <br></br>

          <Row>
            <Col>Event Dates</Col>
            <Col xs={1}></Col>

            <Col>ShiftStart Time</Col>
            <Col>ShiftEnd Time</Col>
            <Col>Shift Posituios</Col>
            <Col xs={1}></Col>

          </Row>
          <Row>
            <br></br>
          </Row>

            {renderEventDatesAndShifts}
            <Row>
                <Col>
                <Button
                        type='button'
                        variant='warning'
                        onClick={addEventDateAndShift}>

                        Add Event And Shift
                    </Button>
                </Col>

            </Row>

        <br></br>
            <Button 
          type='submit' 
          variant='warning' 
          onClick={handleFormSubmit}
          >
          Submit Event</Button>

          <Row>
            <br></br>
          </Row>

            </Form>
        </Stack>
    </Container>

  )
}

export default EditEventForm