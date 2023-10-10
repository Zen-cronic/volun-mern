import React, { useEffect } from 'react'
import { useSendLogOutMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
// emulate Public Header 

const DashHeader = () => {

    const [sendLogOut, {isSuccess: isLogOutSuccess, isError, error, isLoading}] = useSendLogOutMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (isLogOutSuccess) {
            navigate('/')

        }
        

    }, [isLogOutSuccess, navigate])

    if (isLoading) return <p>Logging Out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>


    const content = (
        <header>
            <Navbar bg="dark" variant="dark"  expand='lg' collapseOnSelect>
                <Container className='mx-auto'>
                    <LinkContainer to={"/dash"}>
                        <Navbar.Brand> VolunteerHub Home</Navbar.Brand>
                    </LinkContainer>
                        <Navbar.Toggle aria-controls='basic-navbar-nav'></Navbar.Toggle>
                        <Navbar.Collapse id='basic-navbar-nav'>
                            <Nav className='ms-auto'>

                                <Button type={'button'}
                                     onClick={sendLogOut}
                                     disabled={isLoading} > 

                                    
                                Logout </Button>
                            </Nav>

                        </Navbar.Collapse>
                  
                   
                </Container>
            </Navbar>
           
        </header>
    )
  return content
}

export default DashHeader