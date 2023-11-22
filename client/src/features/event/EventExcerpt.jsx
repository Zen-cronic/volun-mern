
import { useNavigate } from 'react-router-dom';
import React from "react";
import { useSelector } from "react-redux";
import { selectEventById } from './eventsApiSlice';
import { Button } from 'react-bootstrap'; 
import {FaBook} from 'react-icons/fa'
import FilterTagsDisplay from './filter/FilterTagsDisplay';
import useAuth from '../../hooks/useAuth';



//regex for filtered page - conditional col in table


const EventExcerpt = ({ eventId, filterTags }) => {


    const event = useSelector(state => (selectEventById(state, eventId)))
    
    const {role, volunId} = useAuth()
    const navigate = useNavigate()


   
    let content 

    if(!event){

        content = <p>Event NOT found</p>
    }

    else{


        const handleViewEvent = () => {
            
            if(!role && !volunId){
                navigate(`/events/${event.id}`)
                return
            }


            navigate(`/dash/events/${event.id}`)} 
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

                       <FaBook/>
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