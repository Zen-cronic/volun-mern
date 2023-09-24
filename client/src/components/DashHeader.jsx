import React, { useEffect } from 'react'
import { useSendLogOutMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

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

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogOut}
        >
           LOGOUT here
        </button>
    )

    const content = (
        <header>
            <div>
                <Link to="/dash">
                    <h1 >VolunteerHub!</h1>
                </Link>
                <nav>
                    {/* add more buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )
  return content
}

export default DashHeader