import { createSlice } from "@reduxjs/toolkit";
import { eventsAdapter } from "./eventsApiSlice";



export const eventsSlice = createSlice({

    name: 'events',
    // initialState: { filteredEvents: []},
    // initialState: eventsAdapter.getInitialState({
    //     filteredEvents: [],
    //     sortedEvents: [],
    //     searchedEvents: []
    // }),
    initialState: {
        filteredEvents: [],
        sortedEvents: [],
        searchedEvents: []
    },


    reducers: {

        setFilteredEvents: (state, action) => {

            const {sortedIdsWithTags} = action.payload

            console.log('sortedIdsWithTags in setFiltereEvents reducer', sortedIdsWithTags);

            state.filteredEvents = sortedIdsWithTags
        },

        setSortedEvents: (state, action) => {

            const {sortedEvents} = action.payload

            state.sortedEvents = sortedEvents
        },
        setSearchedEvents: (state, action) => {

            const {matchingEvents} = action.payload

            state.searchedEvents = matchingEvents
        },

    }

})

export const {setFilteredEvents, setSortedEvents, setSearchedEvents} = eventsSlice.actions

//not memoized
export const selectFilteredEvents = (state) => state.events.filteredEvents
export const selectSortedEvents = (state) => state.events.sortedEvents
export const selectSearchedEvents = (state) => state.events.searchedEvents

export default eventsSlice.reducer