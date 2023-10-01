import React from 'react'
import { Outlet } from 'react-router'
import VolunSearchBar from './search/VolunSearchBar'
import { Link } from 'react-router-dom'
import VolunSort from './sort/VolunSort'
import useAuth from '../../hooks/useAuth'

const VolunteerHeader = () => {

  const {isAdmin} = useAuth()

  const adminHeaderContent = (<>

    <VolunSearchBar/>
    <VolunSort/>
    <Link to={'/dash/volunteers'}>Back to volunteers list</Link>

  </>)
  return (<>

      {/* {isAdmin && <VolunSearchBar/>}
      {isAdmin && <VolunSort/>}

      <Link to={'/dash/volunteers'}>Back to volunteers list</Link> */}

      {isAdmin && adminHeaderContent}
      
      <Outlet/>
  </>)
}

export default VolunteerHeader