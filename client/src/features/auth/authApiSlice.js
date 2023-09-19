import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({

    endpoints: (builder) => ({


        login: builder.mutation({

            query: (credentials) => ({

                url: '/auth',
                method: 'POST',
                body: {...credentials}
            }),


        }),

        sendLogOut: builder.mutation({

            query: () => ({

                url: '/logout',
                method: 'GET',
                

            }),

            async onQueryStarted(undefined, {dispatch, queryFulfilled}){

                try {
                    const {data} = await queryFulfilled

                    const {message} = data

                    dispatch(logOut())

                    console.log('logout successful message: ', message);


                } catch (error) {
                    console.log('logout Error: ',error);
                }
            }
        }),

        refresh: builder.mutation({

            query: () => ({

                url: '/refresh',
                method: 'GET'
            }),

            async onQueryStarted(undefined, api){

                try {
                    
                    const {data} = await api.queryFulfilled

                    const {accessToken} = data

                    api.dispatch(setCredentials({accessToken}))

                    console.log('new accessToken from authApislice refresh: ', accessToken);
                } catch (error) {
                    console.log('refresh Error: ', error);
                }
            }
        })
    })
})

export const {

    useLoginMutation,
    useRefreshMutation,
    useSendLogOutMutation,

} = authApiSlice