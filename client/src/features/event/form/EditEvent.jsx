import React from 'react'
import { useParams } from 'react-router-dom'
import EditEventForm from './EditEventForm'
import { useSelector } from 'react-redux'
import { selectEventById} from '../eventsApiSlice'
import EditEventForm_Two from './EditEventForm_Two'

const EditEvent = () => {

    const {eventId } = useParams()
    
    //memoized
    const event = useSelector(state => selectEventById(state, eventId))

    //non-memoized
    // const {data: event, isSuccess, isLoading, isError, error} = useGetEventByIdQuery(eventId)
    
    let content 

    if(event){

        // content = (<EditEventForm event={event} eventId={eventId}/>)
        content = (<EditEventForm_Two event={event} eventId={eventId}/>)
    }

    else {
        content = <p>Event loading...</p>
    }

 
  return content
}

export default EditEvent