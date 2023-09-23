import { createSlice } from "@reduxjs/toolkit";
import { eventsAdapter } from "./eventsApiSlice";


export const eventsSlice = createSlice({

    name: 'events',
    // initialState: { filteredEvents: []},
    initialState: eventsAdapter.getInitialState({
        filteredEvents: [],
        sortedEvents: []
    }),

    // reducers: {

    //     setFilteredEvents: (state, action) => {

    //         const {idsWithTags}= action.payload

    //         console.log("idsWithTags from eventSlice: ", idsWithTags);
    //         if(Array.isArray(idsWithTags)){
    //             console.log('idsWithTags is an Array');
    //         }
    //         else{
    //             console.log('idswithTags is NOT an array');
    //         }


    //         state.filteredEvents.push( idsWithTags)
    //     }
    // }

    reducers: {

        setFilteredEvents: (state, action) => {

            const {idsWithTags} = action.payload

            console.log('idsWithTags in setFiltereEvents reducer', idsWithTags);

            state.filteredEvents = idsWithTags
        }
    }

})

export const {setFilteredEvents} = eventsSlice.actions

//not memoized
export const selectFilteredEvents = (state) => state.events.filteredEvents

export default eventsSlice.reducer