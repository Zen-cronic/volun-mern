import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { LinkContainer } from 'react-router-bootstrap'

const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const {role, volunId} = useAuth()
    const content = (
        <section>

            <p>{today}</p>

            <h1>Welcom to VolunteersHub!</h1>

            <p><Link to="/dash/events">View techevents</Link></p>


            
            <p><Link to="/dash/volunteers">View User Settings</Link></p>

            {/* <p><Link to="/dash/volunteers/`${volunId}`">View User Settings</Link></p> */}
            <p><Link to={`/dash/volunteers/${volunId}`}>See your volun info</Link></p>


            
        </section>
    )

    return content
}
export default Welcome