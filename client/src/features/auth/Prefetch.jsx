import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import { store } from '../../app/store';
import { eventsApiSlice } from '../event/eventsApiSlice';
import { volunteersApiSlice } from '../volun/volunteersApiSlice';

const Prefetch = () => {

    useEffect(() => {
        
        const events = store.dispatch(eventsApiSlice.endpoints.getEvents.initiate())

        const volunteers = store.dispatch(volunteersApiSlice.endpoints.getAllVolunteers.initiate())
        return () => {

            events.unsubscribe()
            volunteers.unsubscribe()
            console.log('Unsubscribed');
            
        };
    }, []);
  return (
    
    <Outlet/>
  )
}

export default Prefetch