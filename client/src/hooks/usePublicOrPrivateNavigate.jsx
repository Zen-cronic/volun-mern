import React from 'react'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'

const usePublicOrPrivateNavigate = (pathname) => {
  
    const authObj = useAuth()

    const navigate = useNavigate()

    return () =>{
        if(!(Object.values(authObj).every(val => val))){
            navigate(pathname)
        }
    
        else {
            navigate(`/dash${pathname}`)
        }

    }
 
}

export default usePublicOrPrivateNavigate