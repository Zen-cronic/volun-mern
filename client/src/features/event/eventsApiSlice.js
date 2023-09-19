import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const eventsAdapter = createEntityAdapter()

const eventsInitialState = eventsAdapter.getInitialState()

export const eventsApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder )=> ({

        getEvents: builder.query({

            query: ()=> '/events',

            transformResponse: (response) => {

                const {events} = response

                const normalizedEvents = events.map(event => {

                    event.id = event._id
                    return event
                })

                console.log("normailzed events: ", normalizedEvents);
                return eventsAdapter.setAll(eventsInitialState, normalizedEvents)
            },

            providesTags: (result) => (

                result?
                    [{type: 'Event', id: 'List'},
                    ...result.ids.map(id => ({type: 'Event', id}))]

                :

                    [{type: 'Event', id: 'List'}]
            )
        }),


       postFilteredEvents: builder.mutation({

        query: (filterOptions) => ({

            url: '/events/filter',
            method: 'POST',
            body: {...filterOptions}
        }),


       })
    })
})


const selectedGetEventsResult = eventsApiSlice.endpoints.getEvents.select()

const selectGetEventsData = createSelector(

    selectedGetEventsResult,
    (eventResult) => eventResult.data
)

export const {

    selectById: selectEventById,
    selectIds: selectEventsIds,
    selectAll: selectAllEvents

} = eventsAdapter.getSelectors(state => selectGetEventsData(state) ?? eventsInitialState)
export const {

    useGetEventsQuery,
    usePostFilteredEventsMutation, 

} = eventsApiSlice