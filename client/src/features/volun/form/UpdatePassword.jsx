import React, {useState, useEffect} from 'react'
import { Container, Stack, Form, Button, FloatingLabel } from 'react-bootstrap'
import { usePutUpdateVolunteerInfoMutation } from '../volunteersApiSlice'
import { toast } from 'react-toastify'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {


    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')

    const {volunId} = useAuth()
    const navigate = useNavigate()
    const [updatePassword, {isSuccess: isUpdateSuccess, isLoading}] = usePutUpdateVolunteerInfoMutation()

    useEffect(() => {
       
        if(isUpdateSuccess){
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
            toast.success('Password updated successfully')

            navigate(`/dash/volunteers/${volunId}`)

        }
    }, [isUpdateSuccess, navigate]);

    const handleFormSubmit = async (e) => {

        e.preventDefault()

        if(newPassword !== confirmNewPassword){
            toast.error('New passwords do not match')
            return null
        }

        try {
            const updatedVolunteer = await updatePassword({currentPassword, newPassword, volunId}).unwrap()

            console.log('updatedVolunteer from UpdatePassword: ', updatedVolunteer);

        } catch (error) {
            toast.error('Error updating password')

            console.error('error from UpdatePassword: ', error);

        }



    }

  return (
   <Container>
      <Stack gap={3}>
        <Form>
          <h2>Edit Profile</h2>

          <FloatingLabel
            controlId='volunteerFormInput'
            label='Current Password'
            className="mb-3">
            
            <Form.Control 
              type='password'
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder='Enter current password'

            />
            </FloatingLabel>

          <FloatingLabel
            controlId='volunteerFormInput'
            label='New Password'
            className="mb-3">
            
            <Form.Control 
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder='Enter New password'

            />
            </FloatingLabel>

          <FloatingLabel
            controlId='volunteerFormInput'
            label='Retype new password'
            className="mb-3">
            
            <Form.Control 
              type='password'
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              placeholder='Re-Enter New password'

            />
            </FloatingLabel>

 
        
        
         <Button className='my-2' 
            type='submit' 
            variant='warning' 
            onClick={handleFormSubmit}
            >
            Update Password</Button>
         

           

            </Form>
        </Stack>
    </Container>
  )
}

export default UpdatePassword