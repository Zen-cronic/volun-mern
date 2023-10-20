import React from 'react'
import { useParams } from 'react-router-dom'
import EditEventForm from './EditEventForm'
import { useSelector } from 'react-redux'
import { selectEventById, useGetEventByIdQuery } from '../eventsApiSlice'

const EditEvent = () => {

    const {eventId } = useParams()
    
    //memoized
    const event = useSelector(state => selectEventById(state, eventId))

    //non-memoized
    // const {data: event, isSuccess, isLoading, isError, error} = useGetEventByIdQuery(eventId)
    
    let content 

    if(event){

        content = (<EditEventForm event={event} eventId={eventId}/>)
    }

    else {
        content = <p>Event loading...</p>
    }

    // if(isSuccess){

    //     const {entities} = event

    //     const eventObj = entities[eventId]

    //     content = (<EditEventForm event={eventObj} eventId={eventId}/>)
    // }

    // else if(isLoading){
    //     content = <p>Event loading...</p>
    // }

    // else if(isError){

    //     content = <p>Error: {error}</p>
    // }
  return content
}

export default EditEvent