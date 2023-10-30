
import { useNavigate } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { selectEventById } from './eventsApiSlice';
import { Button } from 'react-bootstrap'; 
import {FaShareAlt} from 'react-icons/fa'
import checkIsFilteredEventsPage from './filter/checkIsFilteredEventsPage';
//chges aft createEA 
//send only the id, and look for each Event using the id and render it 

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
                {filterTags ? <td><label>{filterTags}</label></td> : null}
            </>
        )
    }
    return content
}


export default EventExcerpt