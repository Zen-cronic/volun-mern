import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { selectVolunteerById, useGetUserByIdQuery } from '../volunteersApiSlice'
import EditVolunteerForm from './EditVolunteerForm'

//canNOT use memoized selector cuz PrefetchVOluntters is not used

const EditVolunteer = () => {

    const {volunId} = useParams()

    const {data:volunteerData, isSuccess: isUserDataSuccess, isLoading, isError, error} = useGetUserByIdQuery(volunId)

    let content
    if(isUserDataSuccess){

        const {entities} = volunteerData

        const volunteer = entities[volunId]

        content = <EditVolunteerForm volunteer={volunteer}/>
    }
   
    else if(isLoading){

        content = <p>Volunteer loading...</p>
    }

    else if(isError){

        content = <p>Volunteer not found: {error}</p>
    }
    
  return content
}

export default EditVolunteer