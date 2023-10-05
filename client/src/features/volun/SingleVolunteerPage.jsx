import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import {  useGetUpcomingSignedUpShiftsQuery, useGetUserByIdQuery } from './volunteersApiSlice'
import EventExcerpt from '../event/EventExcerpt'
import EventShift from '../event/EventShift'

//only volun
const SingleVolunteerPage = () => {

    const {volunId} = useParams()

    // const volunteer = useSelector(state => selectVolunteerById(state, volunId))

    const {data: user, isSuccess: isUserDataSuccess, isLoading, isError, error} = useGetUserByIdQuery(volunId)

    const {data: upcomingShiftsData, isSuccess: isUpcomingShiftsSuccess} = useGetUpcomingSignedUpShiftsQuery(volunId)

    console.log('volunteer data via useGetUserById singleVpage: ', user);
   
    let content 

    if(isUserDataSuccess && isUpcomingShiftsSuccess){

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

        const volunteeredShiftsArr = volunteer.volunteeredShifts.map(shiftObj => {

            const shiftId = shiftObj.shiftId
            const shiftDuration = shiftObj.shiftDuration
            // console.log('shiftDuration from volunteeredSHifts: ', shiftDuration);
           return ( 
           
           <li key={shiftObj.shiftId}>

                <label>shiftId: {shiftId}</label>
                <p>shiftDuration: {shiftDuration}</p>
            </li>
           )

    })
        content = (
            <article>
                <h4>Your name: {volunteer.username}</h4>
                <p>your student id: {volunteer.userId}</p>
                <p>totalVolunteeredHours: {volunteer.totalVolunteeredHours}</p>
                <ol>Volunteered Shifts: {volunteeredShiftsArr} </ol>
                <ol>Your upcoming signedUPshifts: {upcomingShiftsArr}</ol>
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