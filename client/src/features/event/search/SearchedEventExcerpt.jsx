
import { useNavigate } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { selectEventById } from '../eventsApiSlice';
import { Button } from 'react-bootstrap'; 
import {FaShareAlt} from 'react-icons/fa'
import HighlightSearchResults from './HighlightSearchResults';



//regex for filtered page - conditional col in table


const SearchedEventExcerpt = ({ eventId, searchTerm }) => {

    const event = useSelector(state => (selectEventById(state, eventId)))
    
    const navigate = useNavigate()


   
    let content 

    if(!event){

        content = <p>Event NOT found</p>
    }

    else{

        const handleViewEvent = () => (navigate(`/dash/events/${event.id}`)) 

        if(!searchTerm){
            console.warn("searchTerm is null");
        }

        content = (

            <>
                <td><HighlightSearchResults text={event.eventName} highlight={searchTerm}/></td>
                <td>{event.eventVenue}</td>
                <td><HighlightSearchResults text={event.eventDescription} highlight={searchTerm}/></td>

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


export default SearchedEventExcerpt