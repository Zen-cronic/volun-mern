import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router'
import { selectEventById } from './eventsApiSlice'

const EventPage = () => {

  const {eventId} = useParams()

  const navigate = useNavigate()
  //vs getEventByIdQuery
  const event =  useSelector(state => (selectEventById(state, eventId)))

  const handleEditEvent = () => {

    // fulll url needed
    navigate(`/events/${eventId}/edit`)
    // navigate(`/edit`)
  }
  let content 


  if(event){

    const eventShifts = event.shifts.map((shiftObj, idx)=> (

        <li key={idx}>

          <p>Shift Start: {shiftObj.localShiftStart}</p>
          <p>Shift End: {shiftObj.localShiftEnd}</p>
        </li>
    ))

    const eventDates = event.localEventDates.map((date,idx) => (

      <li key={idx*100}>{date}</li>

    ))

    content = (
      <article>
          <h1>{event.eventName}</h1>
          <p className="excerpt">{event.eventDescription}</p>
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
            
          <div>
            <button type='button'
                onClick={handleEditEvent}
            >Edit Event - add shift, etc</button>
          </div>
        
        
      </article>


  )

  }
  return (
    <>
      {content}
      {/* <Outlet/> */}
    </>
  )
}

export default EventPage