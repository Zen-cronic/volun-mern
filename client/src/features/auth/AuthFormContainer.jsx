import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const AuthFormContainer = ({children}) => {


  return (
    <Container className='my-3'>
        <Row className='justify-content-md-center mt-5'>
            <Col xs={12} md={6} className='card p-5' >
                {children}
            </Col>
        </Row>
    </Container>
  )
}

export default AuthFormContainer