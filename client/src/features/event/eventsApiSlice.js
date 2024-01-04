import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import {
  setFilteredEvents,
  setSearchedEvents,
  setSortedEvents,
} from "./eventsSlice";
import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const eventsAdapter = createEntityAdapter();

const eventsInitialState = eventsAdapter.getInitialState();

export const eventsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => "/events",

      transformResponse: (response) => {
        const { events } = response;

        const normalizedEvents = events.map((event) => {
          event.id = event._id;
          return event;
        });

        // console.log("normailzed events: ", normalizedEvents);
        return eventsAdapter.setAll(eventsInitialState, normalizedEvents);
      },

      providesTags: (result) =>
        result
          ? [
              { type: "Event", id: "List" },
              ...result.ids.map((id) => ({ type: "Event", id })),
            ]
          : [{ type: "Event", id: "List" }],
    }),

    getEventById: builder.query({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "GET",
      }),

      transformResponse: (responseData) => {
        const { existingEvent } = responseData;

        existingEvent.id = existingEvent._id;

        const serializedEvent = existingEvent;

        console.log(
          "serializedEvent from getEventById slice: ",
          serializedEvent
        );
        return eventsAdapter.setOne(eventsInitialState, serializedEvent);
      },

      providesTags: (result, err, arg) => {
        return [
          ...result?.ids.map((id) => ({
            type: "Event",
            id,
          })),
        ];
      },
    }),

    postFilteredEvents: builder.query({
      query: (filterOptions) => ({
        url: "/events/filter",
        method: "POST",
        body: { ...filterOptions },
      }),

      //omit transformREsponse for eventsFilter state

      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { idsWithTags, sortedIdsWithTags } = data;

          // console.log('data from onQUeryStarted /filter: ', data);

          // console.log("array of entities from {data}: ", Object.values(data.entities));

          const { filteredEvents } = getState().events;
          // console.log('fitleredEvents in state from onQUeryStarted: ', filteredEvents);

          // console.log('idsWIthTags from onQUeryStarted from filter: ', idsWithTags); //DNE after serialization in transformResponse
          dispatch(setFilteredEvents({ sortedIdsWithTags }));
        } catch (error) {
          console.error("filterEvents error: ", error);
        }
      },
    }),

    postSortedEvents: builder.query({
      query: (sortOption) => ({
        url: "/events/sort",
        method: "POST",
        // body: {...sortOption}
        //make it parsable by back
        // body: { [sortOption]: true },
        body: { ...sortOption },
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const { sortedEvents } = data;
          // console.log("data from postSortedEvents queryFulilled: ", data);

          dispatch(setSortedEvents({ sortedEvents }));
        } catch (error) {
          console.log("Sort events Error: ", error);
        }
      },
    }),

    postSearchedEvents: builder.query({
      query: (searchTerm) => ({
        
        url: `/events/search?q=${searchTerm}`,
        method: "POST",
      }),
     

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const { matchingEvents } = data;
          // console.log("data from postSEARCHEDevents queryFulilled: ", data);

          dispatch(setSearchedEvents({ matchingEvents }));
        } catch (error) {
          console.log("Search events Error: ", error);
        }
      },
    }),

    getSignedUpVolunteers: builder.query({
      // query: ({eventId}) => ({   //for lazyQUery fx with {}
      query: (eventId) => ({
        //for normal query wo {}

        url: "/events/volunteers",
        method: "POST",
        body: { eventId },
      }),
    }),

    postNewEvent: builder.mutation({
      query: (newEvent) => ({
        url: "/events",
        method: "POST",
        body: { ...newEvent },
      }),

      transformResponse: (responseData) => {
        const { newEvent } = responseData;

        newEvent.id = newEvent._id;

        const serializedEvent = newEvent;

        // console.log(
        //   "serializedEvent from postNewEvent slice: ",
        //   serializedEvent
        // );
        return eventsAdapter.setOne(eventsInitialState, serializedEvent);
      },

      invalidatesTags: [{ type: "Event", id: "List" }],
    }),

    putUpdateEventInfo: builder.mutation({
      query: (updateEvent) => ({
        url: "/events",
        method: "PUT",
        body: { ...updateEvent },
      }),

      // transformErrorResponse: (errResData) => {

      //   // const {error} = errResData
      //   console.log('error from transformErrorResponse: ', errResData);

      //   errResData.data.sampleProp = 'Im an ERROR'
      //   return errResData
      // },

      invalidatesTags: (result, err, arg) => {
        console.log("arg.eventId from updateEventInfo invalidatetags ", arg);
        return [{ type: "Event", id: arg.eventId }];
      },
    }),

    deleteEvent: builder.mutation({
      //{} for accessing arg.eventId
      query: ({ eventId }) => ({
        url: "/events",
        method: "DELETE",
        body: { eventId },
      }),

      invalidatesTags: (result, err, arg) => {
        return [{ type: "Event", id: arg.eventId }];
      },
    }),
  }),
});

const selectedGetEventsResult = eventsApiSlice.endpoints.getEvents.select();

const selectGetEventsData = createSelector(
  selectedGetEventsResult,
  (eventResult) => eventResult.data
);

export const {
  selectById: selectEventById,
  selectIds: selectEventsIds,
  selectAll: selectAllEvents,
  selectEntities: selectEventsEntities,
} = eventsAdapter.getSelectors(
  (state) => selectGetEventsData(state) ?? eventsInitialState
);

export const {
  useGetEventsQuery,

  useLazyPostFilteredEventsQuery,
  useLazyPostSortedEventsQuery,
  useLazyPostSearchedEventsQuery,

  useGetSignedUpVolunteersQuery,

  usePostNewEventMutation,

  usePutUpdateEventInfoMutation,

  useGetEventByIdQuery,

  useDeleteEventMutation,
} = eventsApiSlice;
