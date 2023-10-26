import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { selectEventById } from './eventsApiSlice'
import useAuth from '../../hooks/useAuth'
import EventShift from './EventShift'


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

    
    const eventShifts = event.shifts.map((shift, idx)=> {

      return <EventShift shift={shift} key={idx} eventId={eventId}/>

  })

    const eventDates = event.localEventDates.map((date,idx) => (

      <li key={idx*100}>{date}</li>

    ))

    content = (
      <article>
          <h1>{event.eventName}</h1>
          <p className="excerpt">Event Description: {event.eventDescription}</p>
          <p>Event VEnue: {event.eventVenue}</p>
          <label>Event Dates: </label>
          <ol key={event.id + 'a'}>
            {eventDates}
          </ol>

          <label>Event Shifts: </label>
          <ol key={event.id + 'b'}>
            {eventShifts}

          </ol>
          {/* <Link to={`/events/${event.id}`}>View Event</Link> */}
            
            {/* only adm */}

          {
            (isAdmin && role==='ADMIN')
              &&
              <div>
            <button type='button'
                onClick={handleEditEvent}
            >Edit Event - add shift, etc</button>

          <button type='button' onClick={handleViewSignedUpVolunteers}>See signedUPVolunteers/stats for admin</button>

          </div>
          }
         
        
        
      </article>


  )

  }
  return content
}

export default EventPage