import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaRegistered, FaSignInAlt } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'

const PublicHeader = () => {


    const headerContent = (

        <header>
            <Navbar bg="dark" variant="dark" collapseOnSelect expand='lg' className=' py-3'>
                <Container>
                    <Navbar.Brand href='/'>Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav' >
                        <Nav className='ms-auto'>
                            <LinkContainer to='/login'>
                                <Nav.Link>
                                    <FaSignInAlt/> Login here
                                </Nav.Link>
                               
                            </LinkContainer>
                          

                            <LinkContainer to='/register'>
                                <Nav.Link>
                                    <FaRegistered/> Register here
                                </Nav.Link> 
                            </LinkContainer>
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
  return (
    <>
        {headerContent}
        {/* <Outlet/> */}
    </>
  )
}

export default PublicHeader