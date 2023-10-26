import React, { useEffect, useState } from 'react'
import { Container, Stack, Form, FloatingLabel, Row, Col, Button } from 'react-bootstrap'
import { usePutUpdateVolunteerInfoMutation } from '../volunteersApiSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EditVolunteerForm = ({volunteer}) => {

    const [formData, setFormData] = useState({
        username: volunteer.username,
        volunId: volunteer.id,
        role: volunteer.role,
        password: volunteer.password,
    })

    const navigate = useNavigate()

    const [updateVolunteerInfo, {isSuccess, isLoading}] = usePutUpdateVolunteerInfoMutation()
    useEffect(() => {
        
        if(isSuccess){

           
            setFormData({

                username: '',
                volunId: '',
                role: '',
                password: '',
            })

            toast.success('Event updated successfully')
            navigate(`/dash/volunteers/${volunteer.id}`)
            
        }

    }, [isSuccess, navigate]);

    const handleFormSubmit = async (e) => {

        e.preventDefault()

        try {
            
            const updatedVolunteer = await updateVolunteerInfo(formData).unwrap()

            console.log('updatedVolunteer from EditVolunteerForm: ', updatedVolunteer);

        } catch (err) {
            toast.error('Error updating volunteer')
        
            console.error('error from EditVolunteerForm: ', err);
        }

    }

    const handleUpdatePassword = () => {

        navigate(`/dash/volunteers/${volunteer.id}/pwd`)
    }

  return (
    <Container>
      <Stack gap={3}>
        <Form>
          <h2>Edit Profile</h2>

          <FloatingLabel
            controlId='volunteerFormInput'
            label='Event Name'
            className="mb-3">
            
            <Form.Control 
              type='text'
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              placeholder='Enter your name'

            />
            </FloatingLabel>

        <br></br>
        
        <Row>
            <Col>
                <Button 
            type='submit' 
            variant='warning' 
            onClick={handleFormSubmit}
            >
            Update Profile</Button>
            </Col>

            <Col>
                <Button
                    type='button'
                    variant='primary'
                    onClick={handleUpdatePassword}
                >
                    Update Password
                </Button>
            </Col>
        </Row>
           

            </Form>
        </Stack>
    </Container>
  )
}

export default EditVolunteerForm