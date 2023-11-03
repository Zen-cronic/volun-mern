import React from 'react'
// import EventFilter from './filter/EventFilter'
import {  Outlet, useNavigate } from 'react-router'
import { Link } from 'react-router-dom';
import EventFilter from './filter/EventFilter';
import EventSort from './sort/EventSort';
import EventSearchBar from './search/EventSearchBar';
import { Container , Row,Col} from 'react-bootstrap';

const EventHeader = () => {


  const eventHeaderContent = (
    
    <Container className='my-2'>

      <Row>
        <Col xs={6} lg={3}>
        {<EventSearchBar/>}
        </Col>

        <Col xs={6} lg={3}>
        {<EventSort/>}
        </Col>

        <Col xs={6} lg={3}>
          <EventFilter/>
        </Col>
     
      </Row>
      
      

    </Container>
    
  )
  return (
    <>
      {eventHeaderContent}
       <Link to={'/dash/events'}>Back to Events List</Link>
      
      <Outlet/>
    </>
  )

       
       
}

export default EventHeader