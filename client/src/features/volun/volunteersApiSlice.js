import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";


export const volunteersAdapter = createEntityAdapter()

const volunteersInitialState = volunteersAdapter.getInitialState()

export const volunteersApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({

        getAllVolunteers: builder.query({

            query: () => '/users',

            transformResponse: (responseData) => {


                const {volunteers} = responseData

                console.log('volunteers', responseData);
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

                console.log('serializedUser from getUserById slice: ', serializedUser);
                return volunteersAdapter.setOne(volunteersInitialState, serializedUser)
            },

            providesTags: (result, err, arg) => {

            
                 return  [

                        ...result?.ids.map(id => ({
                            type: 'POST', id
                        }))
                    ]            
                
                
            }

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

    useGetUserByIdQuery,

    
} = volunteersApiSlice