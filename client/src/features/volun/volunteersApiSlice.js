import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setSearchedVolunteers, setSortedVolunteers } from "./volunteersSlice";


export const volunteersAdapter = createEntityAdapter()

const volunteersInitialState = volunteersAdapter.getInitialState()

export const volunteersApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        getAllVolunteers: builder.query({

            query: () => '/users',

            transformResponse: (responseData) => {


                const {volunteers} = responseData

                // console.log('volunteers', responseData);
                const serializedVolunteers = volunteers.map(volun => {

                    volun.id = volun._id
                    return volun
                })

                return volunteersAdapter.setAll(volunteersInitialState, serializedVolunteers)
            },

            providesTags: (result, err, arg) => (

                result
                ?
                [{type:'Volun', id: 'List'},
                ...result.ids.map(id => ({type: 'Volun', id}))]

                :

                [{type:'Volun', id: 'List'}]
            )
        }),

        patchSignedUpShift: builder.mutation({

            query: (signUpObj) => ({

                url: '/users',
                method: 'PATCH',
                body: {...signUpObj}
            })
        }),

        patchCancelShift: builder.mutation({

            query: (cancelObj) => ({

                url: '/users/cancel',
                method: 'PATCH',
                body: {...cancelObj}

            })
        }),

        getUserById: builder.query({

            query: (id) => ({


                url: `/users/${id}`,

            }),

            transformResponse: (responseData) => {

                const {existingUser} = responseData

                existingUser.id = existingUser._id

                const serializedUser = existingUser

                // console.log('serializedUser from getUserById slice: ', serializedUser);
                return volunteersAdapter.setOne(volunteersInitialState, serializedUser)
            },

            providesTags: (result, err, arg) => {

            
                 return  [

                        ...result?.ids.map(id => ({
                            type: 'POST', id
                        }))
                    ]            
                
                
            }

        }),

        postSearchedVolunteers: builder.query({

            query: (searchQuery) => ({

                url: `/users/search?q=${searchQuery}`,
                method: 'POST',
                

            }),

            async onQueryStarted(arg, {dispatch, queryFulfilled}){

                try {
                    const {data} = await queryFulfilled

                    const {matchingVolunteers} = data

                    dispatch(setSearchedVolunteers({matchingVolunteers}))

                } catch (error) {
                    console.error('onQueryStarted postSearchedVolun error: ', error);
                }
            },
        }),

        postSortedVolunteers: builder.query({

            query: (sortOption) => ({

                url: '/users/sort',
                method: 'POST',
                body: {[sortOption]: true}
            }),

            async onQueryStarted(arg, {queryFulfilled, dispatch}){

                try {
                    const {data} = await queryFulfilled

                    const {sortedVolunteers} = data

                    // console.log("data from onQueryStarted postSorted VOlunters: ", data);

                    dispatch(setSortedVolunteers({sortedVolunteers}))
                } catch (error) {
                    console.error('nQueryStarted postSorted VOlunters errir: ', error);
                }
            }
        }),

        getUpcomingSignedUpShifts: builder.query({

            query: (volunId) => ({

                url: `/users/shifts/${volunId}`,
                method: 'GET',
            }),


        }),

        patchVolunteeredShifts: builder.mutation({

            query: () => ({

                url: '/users/volunteered',
                method: 'PATCH',
            }),

            // not logged as page is reloaded - can only store in state
            async onQueryStarted(undefined, {queryFulfilled}){

                try {
                    const {data} = await queryFulfilled

                    console.log('data from onQueryStarted patchVolunteeredShifts: ', data);
                } catch (error) {
                    console.error('onQueryStarted patchVolunteeredShifts error: ', error);
                }
            }
        }),

        postCheckButtons: builder.query({

            query: (checkObj) => ({

                url: '/users/check-buttons',
                method: 'POST',
                body: {...checkObj}
            })


        }),

        postNewVolunteer: builder.mutation({
            query: (newVolunteer) => ({

                url: '/register',
                method: 'POST',
                body: {...newVolunteer}
            }),

            transformResponse: (responseData) => {

                const {newVolunteer} = responseData

                // console.log(responseData, " responseData from postNewVolunteer slice");
                const serializedVolunteer = newVolunteer

                serializedVolunteer.id = newVolunteer._id

                return volunteersAdapter.setOne(volunteersInitialState, serializedVolunteer)
            },

            // providesTags: (result, err, arg)=> (

            //     result
            //     ?
            //     [{type:'Volun', id: result.ids.map(id => id)}]
            //     :
            //     [{type:'Volun', id: 'List'}]

                

            // )

            invalidatesTags: (

                [{ type: 'Volun', id: "LIST" }]
            )
        })
    })
})

const selectedVolunteersResult = volunteersApiSlice.endpoints.getAllVolunteers.select()

const selectVolunteersData = createSelector(
    selectedVolunteersResult,
    volunteerResult => volunteerResult.data
)

export const {

    selectById: selectVolunteerById,
    selectIds: selectAllVolunteersIds,
    selectAll: selectAllVolunteers

} = volunteersAdapter.getSelectors(state => selectVolunteersData(state) ?? volunteersInitialState)

export const {

    useGetAllVolunteersQuery,
    usePatchSignedUpShiftMutation,
    usePatchCancelShiftMutation,

    // useLazyGetUserByIdQuery,
    useGetUserByIdQuery,

    useLazyPostSearchedVolunteersQuery,
    useLazyPostSortedVolunteersQuery,

    useGetUpcomingSignedUpShiftsQuery,

    usePatchVolunteeredShiftsMutation,

    useLazyPostCheckButtonsQuery,

    usePostNewVolunteerMutation,

} = volunteersApiSlice