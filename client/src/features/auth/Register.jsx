import React, { useEffect, useState } from 'react'
import AuthFormContainer from './AuthFormContainer'
import { Button, Form } from 'react-bootstrap'
import {toast} from 'react-toastify'
import { usePostNewVolunteerMutation } from '../volun/volunteersApiSlice'
import { useNavigate } from 'react-router-dom'
import isValidNumberInput from '../../helpers/isValidNumberInput'

//navigate to login aft successful registration

const Register = () => {
    
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [registerVolunteer, {isSuccess, isLoading}] = usePostNewVolunteerMutation()

  const navigate = useNavigate()

  useEffect(() => {
        
    if(isSuccess){

        setUsername('')
        setUserId('')
        setPassword('')
        navigate('/login')
    }

}, [navigate, isSuccess]);

  //isValidNumberInput as helper fx

  const handleRegisterSubmit = async(e ) => {

    

    e.preventDefault()

    //input validation
    if(password !== confirmPassword){

      toast.error('Passwords do not match')
      return 
    }

    if(!isValidNumberInput(userId)){
      toast.error('Please enter a valid number for your student Id')
      return
    }

    try {
      
      const newVolunteer = await registerVolunteer({username, userId, password}).unwrap()

      //since transformedResonse - unwrapped is an EntityState object
      console.log( " newVolunteer from Register compo - /register route: ", newVolunteer);
    } catch (error) {
      toast.error(error?.data?.message || 'register front error')
    }
  }

  const onUsernameChange = (e) => setUsername(e.target.value)

  const onUserIdChange = (e) => {   setUserId(e.target.value) } 

  const onPasswordChange = (e) => setPassword(e.target.value)

  const onConfirmPasswordChange = (e) => setConfirmPassword(e.target.value)

  return (
    <AuthFormContainer>
      <h2>Register</h2>

      <Form onSubmit={handleRegisterSubmit}>

        <Form.Group className='my-2' controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control 
            
              type='text'
              value={username}
              onChange={onUsernameChange}
              placeholder='Your name'
              />
                
      
        </Form.Group>

        <Form.Group className='my-2'  controlId='userId'>

            <Form.Label>Student Id</Form.Label>
            <Form.Control 
            
           
              type='text'
              // as='number'
              
              value={userId}
              onChange={onUserIdChange}
              placeholder='Your school Id'
              />
        </Form.Group>


        <Form.Group className='my-2' controlId='password'>
          
              <Form.Label>Password</Form.Label>
              <Form.Control 
              
             
                type="password"
                value={password}
                onChange={onPasswordChange}
                placeholder='Your password'
                />

              <Form.Text className='my-2'  id="passwordHelpBlock" muted>
                  Your password must be 8-20 characters long, contain letters and numbers,
                  and must not contain spaces, special characters, or emoji.
              </Form.Text>

        </Form.Group>


        <Form.Group controlId='confirmPassword' className='my-2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              
              type="password"
              value={confirmPassword}
              onChange={onConfirmPasswordChange}
              // placeholder='Confirm password'
              />
        </Form.Group>

        <Button 
        type='submit'
        variant='secondary'
          className='mt-3'
        
        >Register</Button>

        {isLoading && <div>Loading...</div>}

      </Form>
    </AuthFormContainer>
  )
}

export default Register