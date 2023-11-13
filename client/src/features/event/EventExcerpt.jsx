
import { useNavigate } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { selectEventById } from './eventsApiSlice';
import { Button } from 'react-bootstrap'; 
import {FaShareAlt} from 'react-icons/fa'
import FilterTagsDisplay from './filter/FilterTagsDisplay';



//regex for filtered page - conditional col in table


const EventExcerpt = ({ eventId, filterTags }) => {

    const event = useSelector(state => (selectEventById(state, eventId)))
    
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
                <FilterTagsDisplay filterTags={filterTags} />
            </>
        )
    }
    return content
}


export default EventExcerpt