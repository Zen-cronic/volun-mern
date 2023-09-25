import React from 'react'
import useAuth from '../hooks/useAuth'
import { useGetUserByIdQuery } from '../features/volun/volunteersApiSlice'

const DashFooter = () => {

    const {volunId, role, isAdmin, isVolunteer} = useAuth()

    console.log('volunID from DashFooter w useAuth: ', volunId);

    //canNOT use memoized cuz /users is NOT called for a volunteer 
    //when admin logged in, the input result arr DNC the adm's info 

    // const volunteer = useSelector(state => selectVolunteerById(state, volunId))

    const {data: user, isSuccess, isLoading, isError, error} = useGetUserByIdQuery(volunId)

    let content 

    let username
    if( isSuccess){

      const {entities}= user
      const entityState = user
      //id arr, entity Obj
      console.log('entities even when only 1 entity(DashFooter): ',entityState);
      username = entities[volunId].username
    }

    else if(isLoading){

      username = 'Loading'
    }

    else if(isError){

      username = error
    }

    
    content = (
      <>
<section>
    <article>Hey! {username
        } | Status : {role}</article>
        <p>isAdmin: {isAdmin.toString()} </p>
        <p>isVolunteer: {isVolunteer.toString()}</p>
        </section>
      </>
      
    )
  return content
}

export default DashFooter