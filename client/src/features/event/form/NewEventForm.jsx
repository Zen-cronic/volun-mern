import React, { useState, useEffect } from 'react'
import AddEventDateAndShiftTime from './AddEventDateAndShiftTime'
import { Button, Row, Form, Container, Col, Stack, FloatingLabel } from 'react-bootstrap'
import { usePostNewEventMutation } from '../eventsApiSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const NewEventForm = () => {
    const [listId, setListId] = useState(1)
    const [shiftListId, setShiftListId] = useState(1*100)
  
    const navigate =useNavigate()
    const [formData, setFormData] = useState({
  
      eventName: '',
       eventVenue: '',
        eventDates: [], 
        eventDescription: '',
        shifts: []
    })

    const [createNewEvent, {isSuccess, isLoading}] = usePostNewEventMutation()

    useEffect(() => {
      
      // console.log('aft changes in formData.eventDates: ', formData.eventDates);
      // console.log('aft changes in formData.shifts: ', formData.shifts);
      
      if(isSuccess){

        setFormData({
  
          eventName: '',
           eventVenue: '',
            eventDates: [], 
            eventDescription: '',
            shifts: []
        })

        toast.success('Event created successfully')

        navigate('/dash/events')
      }

    }, [isSuccess, navigate]);

    //onClick addEventDateAndSHift, both eventDates and shifts changes
    const addEventDateAndShift = () => {

        setFormData({...formData, 
            eventDates: [...formData.eventDates, {
                listId: listId,
                date: ''
                // childListIdForShift: listId
            }],
            shifts: [...formData.shifts, {
                shiftListId: shiftListId,
                shiftStart: '',
                shiftEnd: '',
                shiftPositions: 0,
                

                parentListIdForShift: listId 
                // parentListIdForShift: listId
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
        
        //nu shiftObj can be mapped for AddEventDatesANdshiftTimes - only eventDateObj
        // const updatedShiftTimes = formData.shifts.filter(shift => shift.shiftListId !== shiftObj.shiftListId)

        const updatedShiftTimes = formData.shifts.filter(shift => shift.parentListIdForShift !== eventDateObj.listId)

        setFormData({...formData,
             
             eventDates: updatedEventDates,
            shifts:updatedShiftTimes})

          
    }



    const renderEventDatesAndShifts = formData.eventDates.map((eventDate) => {

      const correspondingShift = formData.shifts.find(shift => shift.parentListIdForShift === eventDate.listId)
       
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
    />
      )
       

})


   


   


 
    const handleFormSubmit = async(e) => {

        e.preventDefault()

        //TC mini form validation

        const eventDates = formData.eventDates.map(eventDate => (eventDate.date))
        const shifts = formData.shifts.map(shift => {

          const correspondingEvent = formData.eventDates.find(eventDate=>   eventDate.listId === shift.parentListIdForShift)

         const shiftStart = correspondingEvent.date + 'T' + shift.shiftStart
          const shiftEnd = correspondingEvent.date + 'T' + shift.shiftEnd

          return {
            ...shift,
            shiftStart,
            shiftEnd
          }

      
        })

        console.log('------------------');
        console.log('modified shifts: ', shifts);
        console.log('modified eventDates: ', eventDates);
        try {
            
            const newEvent = await createNewEvent(formData).unwrap()

            // console.log('formData to submit: ', formData);

            console.log('newEvent from createNewEvent fribt: ', newEvent);

            //TC navigate
        } catch (err) {
          toast.error('Error creating new event')
            console.error('error from createNewEvent: ',err);
        }
    }
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
            label='Event Venue'
            className="mb-3">
            
            <Form.Control 
              type='text'
              value={formData.eventVenue}
              onChange={e => setFormData({...formData, eventVenue: e.target.value})}
              placeholder='Enter event venue'

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

            </Form>
        </Stack>
    </Container>

  )
}

export default NewEventForm