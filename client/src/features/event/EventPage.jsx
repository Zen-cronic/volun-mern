import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router'
import { selectEventById } from './eventsApiSlice'
import { selectVolunteerById, usePatchCancelShiftMutation, usePatchSignedUpShiftMutation } from '../volun/volunteersApiSlice'
import useAuth from '../../hooks/useAuth'


const EventPage = () => {

  const {eventId} = useParams()

  const navigate = useNavigate()

  const {volunId} = useAuth()

  // const volunId = useSelector(state => selectVolunteerById(state, volunId))
  //vs getEventByIdQuery
  const event =  useSelector(state => (selectEventById(state, eventId)))

  const [signUpShift] = usePatchSignedUpShiftMutation()
  const [cancelShift] =usePatchCancelShiftMutation()

  const handleEditEvent = () => {

    // fulll url needed
    navigate(`/dash/events/${eventId}/edit`)
    // navigate(`/edit`)
  }

  
  let content 


  if(event){

    const eventShifts = event.shifts.map((shiftObj, idx)=> {


        const shiftId = shiftObj._id
        console.log('shiftId: ', shiftId);
        console.log('volunId from useAuth: ', volunId  );
        console.log('eventId from EventPage: ', eventId);
        const handleSignUpShift = async () => {

          try {
            
            const data = await signUpShift({eventId, shiftId, volunId}).unwrap()
      
            console.log('return data from updateSignUPShift from front: ', data)
      
          } catch (error) {
            console.log("updateSignUPShift from front Error: ", error);
          }
        }

        const handleCancelShift = async()=>{

          try {
            
            const data = await cancelShift({eventId, shiftId, volunId}).unwrap()

            console.log('return data from cancelShift from front: ', data)


          } catch (error) {
            console.log("cancelShift from front Error: ", error);
          }
        }



        // const volunId = 
      return (    <li key={idx}>

        <p>Shift Start: {shiftObj.localShiftStart}</p>
        <p>Shift End: {shiftObj.localShiftEnd}</p>
        <p> 
          <button className='signUpButton' type='button' onClick={handleSignUpShift}>Sign Up for shift!</button>
          <button className='cancelSignUp' type='button' onClick={handleCancelShift}>Cancel shift</button>
        </p>
      </li>)
    
  })

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
  return content
}

export default EventPage