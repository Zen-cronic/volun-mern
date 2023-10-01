import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { selectVolunteerById, useGetUpcomingSignedUpShiftsQuery, useGetUserByIdQuery } from './volunteersApiSlice'
import EventExcerpt from '../event/EventExcerpt'
import EventShift from '../event/EventShift'

//only volun
const SingleVolunteerPage = () => {

    const {volunId} = useParams()

    // const volunteer = useSelector(state => selectVolunteerById(state, volunId))

    const {data: user, isSuccess, isLoading, isError, error} = useGetUserByIdQuery(volunId)

    const {data: upcomingShiftsData, isSuccess: isUpcomingShiftsSuccess} = useGetUpcomingSignedUpShiftsQuery(volunId)

    console.log('volunteer data via useGetUserById singleVpage: ', user);
    let content 
    if(isSuccess && isUpcomingShiftsSuccess){

        const {entities} = user

        // const {entities : shiftsEntities } = upcomingShifts

        console.log('upcomingShifts: ', upcomingShiftsData); //{upcomingShifts}

        const {upcomingShifts} = upcomingShiftsData
        const volunteer = entities[volunId]

        const upcomingShiftsArr = upcomingShifts.map(shiftEvent => {

            const eventId = shiftEvent.eventId
            const shifts = shiftEvent.signedUpShifts.map((shift, idx) => {

                // const shiftId = shift._id
                return (
                    <>
                        <EventShift shift={shift} eventId={eventId} key={idx}/>
                    </>
                )
            })
            return (
                <>
                    <EventExcerpt key={eventId} eventId={eventId}/>
                    {shifts}
                </>
            )
        })
        content = (
            <article>
                <h4>Your name: {volunteer.username}</h4>
                <p>your student id: {volunteer.userId}</p>
                <p>Your upcoming signedUPshifts: {upcomingShiftsArr}</p>
            </article>
        )
    }

    // else {
    //     content = (<p>/users NOT prefetched or called from a single volun login</p>)
    // }

    else if(isLoading){

        content = <p>Loading... user info</p>
    }
    else if(isError){

        content = <p>Error... {error}</p>
      }
  
      
  return content
}

export default SingleVolunteerPage