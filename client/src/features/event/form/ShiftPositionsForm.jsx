import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

const ShiftPositionsForm = ({shift, updateShift}) => {
    const [shiftPositions, setShiftPositions] = useState(shift.shiftPositions ?? "")
   
  
    const handleShiftPositionsChange = (e) => {

        setShiftPositions(e.target.value)
        updateShift({...shift, shiftPositions: e.target.value})
    }

    const shiftPositionsForm = (

        <Form.Group controlId='shiftPositions' className='mb-3'> 
            <Form.Control
              type='text'
              value={shiftPositions}
              
              onChange={handleShiftPositionsChange}
            />
        </Form.Group>
    )

    return shiftPositionsForm
}

export default ShiftPositionsForm