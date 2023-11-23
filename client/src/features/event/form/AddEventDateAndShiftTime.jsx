import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import TimePickerForm from './TimePickerForm';
import DatePickerForm from './DatePickerForm';
import ShiftPositionsForm from './ShiftPositionsForm';

const AddEventDateAndShiftTime = ({
    eventDate, 
    listId, 
    shift, 
    shiftListId,
    removeEventAndShift,      
    updateEvent,
    updateShift ,

    eventId

}) => {

  

   
   
    // const handleShiftStartChange = (e) => 
  return (
    <Row >
        <Col  xs={12} sm={6} md={4} lg={3}>
            {<DatePickerForm eventDate={eventDate} updateEvent={updateEvent} eventId={eventId}/>}
        </Col>

        {/* <Col  xs={1}>

      </Col> */}
        <Col>

        {/* {timePickerForm} */}
        <TimePickerForm shift={shift} updateShift={updateShift} startOrEnd={'start'} eventDate={eventDate} />

        </Col>
        <Col>

        {/* {timePickerForm} */}
        <TimePickerForm shift={shift} updateShift={updateShift} startOrEnd={'end'} eventDate={eventDate}/>

        </Col>

        <Col>
          {<ShiftPositionsForm shift={shift} updateShift={updateShift}/>}
        </Col>

      <Col xs={1}>
         <Button
          onClick={e => removeEventAndShift(eventDate)} 
          variant='outline-dark'
        >Delete Event/Shift</Button>

      </Col>
    </Row>
  )
}

export default AddEventDateAndShiftTime