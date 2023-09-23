import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setFilteredEvents } from "./eventsSlice";

export const eventsAdapter = createEntityAdapter()

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


       postFilteredEvents: builder.query({

        query: (filterOptions) => ({

            url: '/events/filter',
            method: 'POST',
            body: {...filterOptions}
        }),

    //omit transformREsponse for eventsFilter state
        // transformResponse: (responseData) => {

        //     const {idsWithTags} = responseData
        //     // console.log('idsWithTags from responseData: ', idsWithTags);

        //     // if(idsWithTags?.length){
        //     //     const normailzedFilteredEvents = idsWithTags.map(event=> {

        //     //         event.id = event.eventId 
        //     //         return normailzedFilteredEvents
        //     //     })

        //     // }

        //     const normailzedFilteredEvents = idsWithTags.map(event=> {
        //         event.id = event.eventId 
        //         return event
        //     })

        //     return eventsAdapter.setAll(eventsInitialState, normailzedFilteredEvents)
        // },

        async onQueryStarted(arg, {dispatch, getState, queryFulfilled}){

            try {

                const {data} = await queryFulfilled
                const {idsWithTags} = data


                console.log('data from onQUeryStarted /filter: ', data);

                // console.log("array of entities from {data}: ", Object.values(data.entities));

                const {filteredEvents} = getState().events
                console.log('fitleredEvents in state from onQUeryStarted: ', filteredEvents);
                console.log('idsWIthTags from onQUeryStarted from filter: ', idsWithTags); //DNE after serialization in transformResponse
                dispatch(setFilteredEvents({idsWithTags}))

            } catch (error) {
                console.log('filterEvents error: ',error);
            }
        },
        // providesTags: (result, err, arg) => (
        
        // //result no longer has ids & entities if transformResponse is NOT used
        //     // [result.ids.map(id => ({type:'Event', id}))]
        //     [result.map(id => ({type:'Event', id}))]
        // )



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
    usePostFilteredEventsQuery, 
    useLazyPostFilteredEventsQuery,

} = eventsApiSlice