import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { store } from '../../app/store';
import { eventsApiSlice } from '../event/eventsApiSlice';

const PrefetchEvents = () => {

    
    useEffect(() => {
        
        const events = store.dispatch(eventsApiSlice.endpoints.getEvents.initiate())

        return () => {

            events.unsubscribe()
            console.log('Unsubscribed Events');
            
        };
    }, []);
  return (
    
    <Outlet/>
  )
}

export default PrefetchEvents