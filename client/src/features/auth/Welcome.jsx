import { Link } from 'react-router-dom'

const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section>

            <p>{today}</p>

            <h1>Welcom to VolunteersHub!</h1>

            <p><Link to="/dash/events">View techevents</Link></p>

            {/* <p><Link to="/dash/events/new">Add New techNote</Link></p> */}

            <p><Link to="/dash/volunteers">View User Settings</Link></p>

            {/* register */}
            {/* <p><Link to="/dash/volunteers/new">Add New User</Link></p> */}

        </section>
    )

    return content
}
export default Welcome