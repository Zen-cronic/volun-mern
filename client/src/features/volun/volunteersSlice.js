// for searched and sorted volun

import { createSlice } from "@reduxjs/toolkit";
import { volunteersAdapter } from "./volunteersApiSlice";


export const volunteersSlice = createSlice({


    name:'volunteer',
    initialState: volunteersAdapter.getInitialState({

        sortedVolunteers: [],
        searchedVolunteers: []
    }),
    reducers: {

        setSearchedVolunteers: (state, action) => {

            const {matchingVolunteers} = action.payload

            state.searchedVolunteers = matchingVolunteers
        },
        setSortedVolunteers: (state, action) => {

            const {sortedVolunteers} = action.payload

            state.sortedVolunteers = sortedVolunteers
        },

    }
})

export const selectSearchedVolunteers = (state) => state.volunteers.searchedVolunteers
export const selectSortedVolunteers = (state) => state.volunteers.sortedVolunteers

export const {setSortedVolunteers, setSearchedVolunteers} = volunteersSlice.actions

export default volunteersSlice.reducer