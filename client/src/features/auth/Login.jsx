import React, {useState, useEffect} from 'react'
import { useLoginMutation } from './authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router';
import usePersist from '../../hooks/usePersist';
import { Form, Button, } from 'react-bootstrap';
import AuthFormContainer from './AuthFormContainer';
import { toast } from 'react-toastify';
const Login =() => {

    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, {isSuccess, isLoading}] = useLoginMutation()
    
    const [persist, setPersist] = usePersist()

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

        
        dispatch( setCredentials({accessToken}))



      } catch (error) {

        toast.error(error?.data?.message)
        // console.error("Login error: ", error)
      }
    }

    const handlePersistToggle = () => setPersist(prev => !prev)


  return (

    <AuthFormContainer>
        <h3>Sign In Here</h3>
      <Form onSubmit={handleLoginSubmit}>
          <Form.Group className='my-2' controlId='userId'> 
            <Form.Label>Student/Employee Id</Form.Label>
            <Form.Control
            
                type='text'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder='Your school Id'
                aria-describedby='passwordHelpBlock'
                >
          
            </Form.Control>
      
          </Form.Group>
        
        
          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control 
            type='password' 
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          </Form.Group>  
          
          <Button 
          type='submit'
          variant='primary'
          className='mt-3'
          >Sign In
          </Button>

          <Form.Group className='my-2' controlId='persistCheckbox'>
            <Form.Check
            type='switch'
              onChange={handlePersistToggle}
              checked={persist}
              label='Trust this device'
            >
             
            </Form.Check>
            
          </Form.Group>
        
        {isLoading && <div>Loading...</div>}

      </Form>


    </AuthFormContainer>
  )
}

export default Login