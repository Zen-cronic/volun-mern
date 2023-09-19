import { createSlice } from "@reduxjs/toolkit";


const initialAuthState = {
    token: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {

        logOut: (state) => {

            state.token = null
        },

        setCredentials: (state, action) => {

  
            const {accessToken} = action.payload

                    //DNEX executes
            // console.log(accessToken, " accesssToken from authSlice");

            if(accessToken){
                state.token = accessToken

            }
        }
    }
})

export const {logOut, setCredentials} = authSlice.actions

export const selectCurrentToken = (state)=> (state.auth.token)

export default authSlice.reducer

