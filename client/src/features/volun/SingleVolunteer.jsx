import React from 'react'
import { useSelector } from 'react-redux'
import { selectVolunteerById } from './volunteersApiSlice'

const SingleVolunteer = ({volunId}) => {

    const volunteer = useSelector((state)=> selectVolunteerById(state, volunId))

    let content 
    
    if(!volunteer){

        content = <p>Volunteer NOT found</p>
    }

    else{

        content = (
            <article>
                <h2>{volunteer.username}</h2>
                <p>student id: {volunteer.userId}</p>
                {/* <Link to={`/volunteers/${volunteer.id}`}>View volunteer</Link> */}
                  
              
              
            </article>
        )
    }
    return content
}

export default SingleVolunteer