import React, {useState, useEffect} from 'react'
import { useLoginMutation } from './authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router';

const Login =() => {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, {isSuccess, isLoading, isError, error}] = useLoginMutation()
    
    useEffect(() => {
        
        if(isSuccess){

            setUserId('')
            setPassword('')
            navigate('/dash')
        }

    }, [navigate, isSuccess]);


    const handleLoginSubmit = async (e) => {

        e.preventDefault()

      try {
        const {accessToken} = await login({userId, password}).unwrap()

        console.log(accessToken, " accessToken from Login compo - /auth route");
        
       const data = dispatch( setCredentials({accessToken}))

       console.log("setCredentials data: ", data);

      } catch (error) {
        console.error("Login error: ", error)
      }
    }
  return (

    <>
    <h3>Login With your student Id and school password</h3>
    <form 
    onSubmit={handleLoginSubmit}

    >

        <label>UserId</label>
        <input
            type='text'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
        />
        <label>Password</label>
        <input
            type='text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button type='submit'
         >Submit</button>
    </form>


    </>
  )
}

export default Login