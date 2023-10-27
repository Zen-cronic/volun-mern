import React from 'react'
import { useParams } from 'react-router-dom'
import { selectEventById, useGetSignedUpVolunteersQuery } from './eventsApiSlice'
import { useSelector } from 'react-redux'
import EventShift from './EventShift'
import SingleVolunteerExcerpt from '../volun/SingleVolunteerExcerpt'

//call EnvetShift for each shift PLUS the stats
const EventStats = () => {

    const {eventId} = useParams()
    const event =  useSelector(state => (selectEventById(state, eventId)))

    const {data: signedUpVolunteers, isSuccess, isLoading, isError, error } = useGetSignedUpVolunteersQuery(eventId)


    let content 

   if(isSuccess && event){
        // console.log('data from useGetSIngedUPV query: ', signedUpVolunteers);

        const {shiftVolunteers, totalUniqueVolunteers} = signedUpVolunteers
     
        

       const eventShifts = event.shifts.map((shift, idx)=> {

           const foundShift =  shiftVolunteers.find(shiftVolunObj => shiftVolunObj.shiftId === shift._id.toString())

        //    console.log('foundShift: ', foundShift);

        //    govern EventShift and following with 1 unique key
           return (
               
            
                <>
                    <EventShift shift={shift} key={idx} eventId={eventId}/>
                    
                    
                        <label>SignedUP volunteer for event: </label>
                        {foundShift.volunteerIds.length 
                        ? 
                        foundShift.volunteerIds.map(volunId => (
                       
                            (<SingleVolunteerExcerpt key={volunId} volunId={volunId}/>)
                        ))
                        :
                        <p>No volunteers signed up</p>
                        }
                        <br></br>
                    
                </>
           )
      
        })

    const allVolunteersForEvent = totalUniqueVolunteers.uniqueVolunteersIds.map(volunId => 
            
            (<SingleVolunteerExcerpt volunId={volunId} key={volunId}/>))

    const totalVolunteersCount = totalUniqueVolunteers.count
        
       content =  <>
                <ol> {eventShifts} </ol>
                <div>
                    <p>ALl volunteers signed up</p>
                    <ol>{allVolunteersForEvent}</ol>
                </div>

                <label>Total Volunteers: {totalVolunteersCount}</label>
                
       </>


   }

  return (
    content
  )
}

export default EventStats