import React from 'react'
import { Outlet } from 'react-router'
import VolunSearchBar from './search/VolunSearchBar'
import { Link } from 'react-router-dom'
import VolunSort from './sort/VolunSort'
import useAuth from '../../hooks/useAuth'
import PatchVolunteeredShiftsButton from './PatchVolunteeredShiftsButton'
import { Container, Row, Col } from 'react-bootstrap'
const VolunteerHeader = () => {

  const {isAdmin} = useAuth()

  const adminHeaderContent = (

    <Container className='my-2'>

      <Row>
        <Col xs={6} lg={3}>
          <VolunSearchBar/>
        </Col>

        <Col xs={6} lg={3}>
          <VolunSort/>
        </Col>
     
      </Row>
      
      <Link to={'/dash/volunteers'}>Back to volunteers list</Link>

    </Container>)
  return (<>


      {isAdmin && adminHeaderContent}
      <PatchVolunteeredShiftsButton/>
      <Outlet/>
  </>)
}

export default VolunteerHeader