import React from 'react'
import useAuth from '../hooks/useAuth'
import { useGetUserByIdQuery } from '../features/volun/volunteersApiSlice'
import { Col, Container, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

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

      <footer className='bg-secondary text-white position-relative bottom-0 w-100  h-auto border-top'>
        <Container >
          <Row className='py-2'>
            <Col>
                
                  <Link to={'/dash'}> Home </Link>
               
            </Col>


            <Col>
              <section>
               <article>Hey! {username} | Status : {role}</article>
                <p>isAdmin: {isAdmin.toString()} </p>
                <p>isVolunteer: {isVolunteer.toString()}</p>
              </section>
            </Col>
            <Col>
                <p> Copyright &copy; KZH 2023</p>

            </Col>
          </Row>
        </Container>
      </footer>
      
    )
  return content
}

export default DashFooter