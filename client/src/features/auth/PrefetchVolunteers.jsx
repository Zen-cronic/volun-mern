import React, { useEffect } from 'react'
import { store } from '../../app/store';
import { volunteersApiSlice } from '../volun/volunteersApiSlice';
import { Outlet } from 'react-router';
import useAuth from '../../hooks/useAuth';

const PrefetchVolunteers = () => {

    const {role, isAdmin} = useAuth()

    if(role !== 'ADMIN' && !isAdmin){

      return <Outlet/>
    }
    
    useEffect(() => {
        const volunteers = store.dispatch(volunteersApiSlice.endpoints.getAllVolunteers.initiate())

        return () => {
            volunteers.unsubscribe()
            console.log('Unsubscribed Volunteers');
        }; 

    }, []);
  return (
    <Outlet/>
  )
}

export default PrefetchVolunteers