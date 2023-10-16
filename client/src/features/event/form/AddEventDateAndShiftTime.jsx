import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap';
import TimePickerForm from './TimePickerForm';
import DatePickerForm from './DatePickerForm';

const AddEventDateAndShiftTime = ({
    eventDate, 
    listId, 
    shift, 
    shiftListId,
    removeEventAndShift,      
    updateEvent,
    updateShift  

}) => {

  

    //state as number vs as string
    const [shiftPositions, setShiftPositions] = useState(0)

 
  
    const shiftPositionsForm = (

        <Form.Group controlId='shiftPositions' className='mb-3'> 
            <Form.Control
              type='number'
              value={shiftPositions}
              
              onChange={(e) => setShiftPositions(e.target.value)}
            />
        </Form.Group>
    )
    // const handleShiftStartChange = (e) => 
  return (
    <Row>
        <Col >
            {<DatePickerForm eventDate={eventDate} updateEvent={updateEvent}/>}
        </Col>

        <Col xs={1}>

      </Col>
        <Col>

        {/* {timePickerForm} */}
        <TimePickerForm shift={shift} updateShift={updateShift} startOrEnd={'start'}/>

        </Col>
        <Col>

        {/* {timePickerForm} */}
        <TimePickerForm shift={shift} updateShift={updateShift} startOrEnd={'end'}/>

        </Col>

        <Col>
          {shiftPositionsForm}
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