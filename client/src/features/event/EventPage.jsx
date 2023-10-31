import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectEventById } from './eventsApiSlice'
import useAuth from '../../hooks/useAuth'
import EventShift from './EventShift'
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap'
import convertEventDisplayDate from '../../helpers/convertEventDisplayDate'
import EventShiftTable from './EventShiftTable'


const EventPage = () => {

  const {eventId} = useParams()

  const navigate = useNavigate()

  const {role, isAdmin} = useAuth()

  // const {data: user, isSuccess: isUserDataSuccess, isLoading, isError, error} = useGetUserByIdQuery(volunId)

  // const volunId = useSelector(state => selectVolunteerById(state, volunId))
  //vs getEventByIdQuery
  const event =  useSelector(state => (selectEventById(state, eventId)))

  const handleEditEvent = () => {

    // fulll url needed
    navigate(`/dash/events/${eventId}/edit`)
    // navigate(`/edit`)
  }

  const handleViewSignedUpVolunteers = async() => {

 

    navigate(`/dash/events/${eventId}/stats`)

  }

  let content 

  

  if(event){

    
  //   const eventShifts = event.shifts.map((shift, idx)=> {

  //     return <EventShift shift={shift} key={idx} eventId={eventId}/>

  // })

    const eventDates = event.localEventDates.map((date,idx) => {

      const displayDate = convertEventDisplayDate(date.split(' ')[0].concat('T00:00'))

      return (<ListGroup.Item as='li' className='w-25 border-2' key={idx}>{displayDate}</ListGroup.Item>)

    })

    const adminContent = (

      (isAdmin && role==='ADMIN')

      &&

      <Row className='my-2'>

        <Col>
          <Button type='button'
          onClick={handleEditEvent}
          >Edit Event - add shift, etc</Button>
        </Col>

        <Col>
        <Button type='button' onClick={handleViewSignedUpVolunteers}>See signedUPVolunteers/stats for admin</Button>

        </Col>



      </Row>
    
 
        
    )

    content = (
      
      <Container fluid className='py-2'
       >
     
          <Row>
            <Col>
            <h1>{event.eventName}</h1>
            </Col>
           
          </Row>
          
          <Row>
            <Col>
            <p className="excerpt">Event Description: {event.eventDescription}</p>

            </Col>
          </Row>
        
          <Row>
             <Col>
             <p>Event VEnue: {event.eventVenue}</p>

             </Col>

          </Row>

          <Row>

            <Col>
              <label>Event Dates: </label>
              <ListGroup as='ol' numbered>
                 
                  {eventDates}
              </ListGroup>
            
            </Col>
          </Row>

          <Row>
            <Col>
              <label>Event Shifts: </label>
              <EventShiftTable shifts={event.shifts} eventId={eventId}/>
            </Col>
          </Row>
          

         
          {adminContent }
         
        
        
      </Container>


  )

  }
  return content
}

export default EventPage