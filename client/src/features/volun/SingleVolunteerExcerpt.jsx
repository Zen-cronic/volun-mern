import React from 'react'
import { useSelector } from 'react-redux'
import { selectVolunteerById } from './volunteersApiSlice'

const SingleVolunteerExcerpt = ({volunId}) => {

    const volunteer = useSelector((state)=> selectVolunteerById(state, volunId))

    let content 
    
    if(!volunteer){

        content = <p>Volunteer NOT found</p>
    }

    else{

        content = (
            <>
                <td>{volunteer.username}</td>
                <td>{volunteer.userId}</td>
                <td>{volunteer.totalVolunteeredHours}</td>
           
        </>
        )
    }
    return content
}

export default SingleVolunteerExcerpt