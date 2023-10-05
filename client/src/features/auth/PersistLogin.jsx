import React, {useState, useEffect, useRef,} from 'react'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import { useRefreshMutation } from './authApiSlice'
import { Outlet } from 'react-router'

const PersistLogin = () => {


    const [persist] = usePersist()

    const currentToken = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {isSuccess, isLoading, isError, error, isUninitialized}] = useRefreshMutation()

    useEffect(() => {
        if(effectRan.current === true || process.env.NODE_ENV !== 'development'){

            const verifyRefreshRoute = async () => {

                console.log('verifying accessToken from /refresh from PersistLogin');

                try {
                    const {accessToken  } = await refresh().unwrap()
                    console.log('new AccessTOkne from PersistLogin: ', accessToken);

                    setTrueSuccess(true)

                } catch (error) {
                    console.error(error);
                }
            }

            if(!currentToken && persist){
                verifyRefreshRoute()
            }
        }

        return () => 
            effectRan.current = true
        

        //eslint-disable-next-line
    }, []);


    let content 

    if(!persist){
        content = <Outlet/>
    }

    else if(isLoading){

        content = <p>Loading... persist Login refresh</p>
    }

    else if(isError){

        content = (
            <p>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again!</Link>.
            </p>
        )

    }

    else if(currentToken && isUninitialized){
        content = <Outlet/>
    }

    else if(isSuccess && trueSuccess){
        content = <Outlet />
    }


  return content
}

export default PersistLogin