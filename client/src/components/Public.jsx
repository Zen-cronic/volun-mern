import { Link } from 'react-router-dom'
import {Container, Nav, Navbar} from 'react-bootstrap'
import {FaSignInAlt, FaRegistered} from 'react-icons/fa'
import {LinkContainer} from 'react-router-bootstrap'

const Public = () => {


    const headerContent = (

        <header>
            <Navbar bg="dark" variant="dark" collapseOnSelect expand='lg'>
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
                            {/* <Nav.Link href='/login'>
                                <FaSignInAlt/> Login here
                            </Nav.Link> */}

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
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Volunteers!</span></h1>
            </header>
            <main>
                <p>For all students across ...</p>
                
                <br />
            </main>
            <footer>
                
                <Link to="/login">Volunteer Login</Link>

                {/* volun sign up */}
                {/* <Link to="/login">Volunteer Login</Link> */}

            </footer>
        </section>

    )
    return (

        <>
            {headerContent}
            {content}
        </>
    )
}
export default Public