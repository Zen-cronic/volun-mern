import React from 'react'
import { useParams } from 'react-router'

const EditEventForm = () => {

  const {eventId} = useParams()


  
  return (
    <div>EditEventForm Only accessible by admin</div>
  )
}

export default EditEventForm