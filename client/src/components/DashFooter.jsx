import React from 'react'
import useAuth from '../hooks/useAuth'
import { useGetUserByIdQuery } from '../features/volun/volunteersApiSlice'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const DashFooter = () => {

    const {volunId, role} = useAuth()

    console.log('volunID from DashFooter w useAuth: ', volunId);

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

      <footer className='bg-secondary text-white position-relative bottom-0 w-100  h-auto'>
        <Container className=' pt-4' >
          <Row className='py-2'>
            <Col>
                
                <Button as={Link} to='/dash' variant='warning' >
                Home
                </Button>
               
            </Col>


            <Col>
               <p>Hey! {username} | Status : {role}</p>
                {/* <p>isAdmin: {isAdmin.toString()} </p>
                <p>isVolunteer: {isVolunteer.toString()}</p> */}
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