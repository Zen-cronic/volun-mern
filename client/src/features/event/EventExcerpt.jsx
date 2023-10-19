
import { Link, useNavigate } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { selectEventById } from './eventsApiSlice';
import { Button } from 'react-bootstrap'; 
import {FaShareAlt} from 'react-icons/fa'
//chges aft createEA 
//send only the id, and look for each Event using the id and render it 

const EventExcerpt = ({ eventId }) => {

    const event = useSelector(state => (selectEventById(state, eventId)))
    
    // console.log('each event entity for eventExcerpt: ', event);

    const navigate = useNavigate()

   

    let content 

    if(!event){

        content = <p>Event NOT found</p>
    }

    else{

        const handleViewEvent = () => (navigate(`/dash/events/${event.id}`)) 
        content = (

            <>
                <td>{event.eventName}</td>
                <td>{event.eventVenue}</td>
                <td>{event.eventDescription}</td>
                <td>
                    <Button 
                        type='button'
                        onClick={handleViewEvent}
                        variant='warning'>

                       <FaShareAlt/>
                        Details
                    </Button>
                </td>
            </>
        )
    }
    return content
}


export default EventExcerpt