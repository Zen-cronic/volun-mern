
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import useAuth from '../../hooks/useAuth'

const RequireAuth = ({allowedRole}) => {

    const location = useLocation()
    const {role} = useAuth()


    if(allowedRole.includes(role)){

        return <Outlet/>
    }
    
    else{

        return <Navigate to={'/login'} state={{from: location}} replace/>
        
    }
}

export default RequireAuth