import React from 'react'
import { Table,  Container } from 'react-bootstrap'
import EventShift from './EventShift'
import useAuth from '../../hooks/useAuth'


const EventShiftTable = ({shifts, eventId}) => {


    //conditional table
    const {isVolunteer ,role} = useAuth()
    
    const tableBodyContent = shifts.map((shift, idx) => (

             (
                <tr key={shift.shiftId}>
                    <EventShift shift={shift} key={shift.shiftId} eventId={eventId} />

                </tr>
            )
    ))
    
  return (
    <Container className='my-2 px-3'>
    <Table striped bordered hover >

        <thead >
          <tr>
            <th scope='col'>Shift Start</th>
            <th scope='col'>Shift End</th>
            <th scope='col'>Shift Duration</th>
            <th scope='col'>Open Positions</th>

            {/* {(isVolunteer && role==='VOLUNTEER') ? <th scope='col'>SignUp/Cancel</th>
                : null
            } */}

            {(isVolunteer && role === 'VOLUNTEER') ? (
  <th scope='col' style={{ display: 'none'}}>
    <span className='visually-hidden'>SignUp/Cancel</span>
  </th>
) : null}
        
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