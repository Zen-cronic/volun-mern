import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import { store } from '../../app/store';
import { eventsApiSlice } from '../event/eventsApiSlice';

const Prefetch = () => {

    useEffect(() => {
        
        const events = store.dispatch(eventsApiSlice.endpoints.getEvents.initiate())

        return () => {

            events.unsubscribe()
            console.log('Unsubscribed');
            
        };
    }, []);
  return (
    
    <Outlet/>
  )
}

export default Prefetch