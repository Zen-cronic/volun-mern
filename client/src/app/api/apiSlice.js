import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice';

const apiBaseUrl =import.meta.env.VITE_API_PROD_URL || ""
const baseQuery = fetchBaseQuery({

    baseUrl: apiBaseUrl,
    credentials: 'include',
    prepareHeaders: async(headers, api) => {

        const currentToken = api.getState().auth.token

        if(currentToken){

            headers.set('Authorization', `Bearer ${currentToken}`)
        }

        return headers
    }
})

const baseQueryWithRefreshAuth = async (args, api, extraOptions) => {

    let originalResult = await baseQuery(args, api, extraOptions)

    //forbidden from verifyJWT
    if(originalResult?.error?.status === 403){

        console.log('calling /refresh to gen new accessToken');

        const refreshResult = await baseQuery('/refresh', api, extraOptions)

        if(refreshResult?.data){

            const {accessToken } = refreshResult.data

            api.dispatch(setCredentials({accessToken}))

            originalResult = await baseQuery(args, api, extraOptions)

            
        }
        else{

            if(refreshResult?.error?.status === 403){

                refreshResult.error.message = 'Your login has expired '
            }

            console.log("refreshResutlt with error.message: ", refreshResult);
            return refreshResult
        }
    }

    return originalResult
}


export const apiSlice = createApi({

    baseQuery: baseQueryWithRefreshAuth,
    tagTypes:['Event', 'Volun'],
    reducerPath: 'api',
    endpoints: (builder) => ({})

})