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
    <Row>
        <Col >
            {<DatePickerForm eventDate={eventDate} updateEvent={updateEvent} eventId={eventId}/>}
        </Col>

        <Col xs={1}>

      </Col>
        <Col>

        {/* {timePickerForm} */}
        <TimePickerForm shift={shift} updateShift={updateShift} startOrEnd={'start'} />

        </Col>
        <Col>

        {/* {timePickerForm} */}
        <TimePickerForm shift={shift} updateShift={updateShift} startOrEnd={'end'} />

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