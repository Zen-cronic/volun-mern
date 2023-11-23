import React from 'react'
import { Table,  Container } from 'react-bootstrap'
import EventShift from './EventShift'
import useAuth from '../../hooks/useAuth'


const EventShiftTable = ({shifts, eventId}) => {


    //conditional table col
    const {isVolunteer ,role} = useAuth()
    
    if(!Array.isArray(shifts)){
        console.log('shifts for EventShiftTable is not an array');
        return null
    }
    
    const tableBodyContent = shifts.map((shift) => (

             (
                <tr key={shift.shiftId}>
                    <EventShift shift={shift} key={shift.shiftId} eventId={eventId} />
                </tr>
            )
    ))
    
  return (
    <Container className='my-2 '>
    <Table striped bordered hover >

        <thead >
          <tr>
            <th scope='col'>Shift Start</th>
            <th scope='col'>Shift End</th>
            <th scope='col'>Shift Duration</th>
            <th scope='col'>Open Positions</th>
            {(isVolunteer && role==='VOLUNTEER') ? <th scope='col'>SignUp/Cancel</th>
                : null
            }
          </tr>
        </thead>

        <tbody>
          {tableBodyContent}
        </tbody>
    </Table>
  </Container>

  )
}

export default EventShiftTable