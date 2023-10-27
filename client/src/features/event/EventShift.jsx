import React, {useRef, useState} from 'react'
import useAuth from '../../hooks/useAuth';
import { useLazyPostCheckButtonsQuery, usePatchCancelShiftMutation, usePatchSignedUpShiftMutation } from '../volun/volunteersApiSlice';
import { useEffect } from 'react';
import { Button, Row , Col, OverlayTrigger, Tooltip} from 'react-bootstrap';
import convertShiftDisplayDateTime from '../../helpers/convertShiftDisplayDateTime';
import {toast} from 'react-toastify'


import 'react-toastify/dist/ReactToastify.css'


const EventShift = ({shift, eventId}) => {

  const {role, isVolunteer, volunId} = useAuth()


  const shiftId = shift?._id

  const [disableSignUpButton, setDisableSignUpButton] = useState(false)
  const [disableCancelButton, setDisableCancelButton] = useState(false)
  const [signUpShift,] = usePatchSignedUpShiftMutation()
  const [cancelShift,] =usePatchCancelShiftMutation()

  const [signUpMessage, setSignUpMessage] =useState("")
  const [cancelMessage, setCancelMessage] =useState("")

  //canNOT use memoized selector for volunteer - /users isNOT memoized
  // const volunteer = useSelector(state => selectVolunteerById(state, volunId))

  const [checkButton] = useLazyPostCheckButtonsQuery()


  useEffect(() => {
    
    const disableSignUpButton = async()=>{

      //try Promise.all for both buttons
      try {

        const [updatableData, cancelableData] = await Promise.all([
         checkButton({eventId, shiftId, volunId, buttonType: 'signup'}).unwrap(), 
         checkButton({eventId, shiftId, volunId, buttonType: 'cancel'}).unwrap()])


        console.log('return updatabledata from checkButton from front: ', updatableData);
        console.log('return cancelableData from checkButton from front: ', cancelableData);

        const {disable: disableUpdate, message: signUpMsg} = updatableData
        const {disable: disableCancel, message: cancelMsg} = cancelableData
  
        setDisableSignUpButton(disableUpdate)
        setDisableCancelButton(disableCancel)

        setSignUpMessage(signUpMsg)
        setCancelMessage(cancelMsg)
  
      } catch (error) {
        console.log('disableSignUpButton error: ', error);
      }
    }

    disableSignUpButton()
  }, []);
  
  
  
  const handleSignUpShift = async () => {

    
    if(disableSignUpButton){

      return
    }

    try {
      
      const data = await signUpShift({eventId, shiftId, volunId}).unwrap()

      console.log('return data from updateSignUPShift from front: ', data)

      //modal 
      window.location.reload(true)
      // if(isSignUpSuccess){
      //   console.log('signedUP');
      //   window.location.reload(true)
      //   // location.replace('/dash/events')

      // }

    } catch (error) {
      console.log("updateSignUPShift from front Error: ", error);
    }
  }

  const handleCancelShift = async()=>{

    if(disableCancelButton){
     
      return
      
    }
    try {
      
      const data = await cancelShift({eventId, shiftId, volunId}).unwrap()

      //not logged as page is reloaded, only the onQueryStartred is logged
      console.log('return data from cancelShift from front: ', data)

      window.location.reload(true)


    } catch (error) {
      console.log("cancelShift from front Error: ", error);
    }
  }

  

return (   
  


  <>
  <td>{convertShiftDisplayDateTime(shift?.localShiftStart)}</td>
  <td>{convertShiftDisplayDateTime(shift?.localShiftEnd)}</td>
  <td>{shift?.shiftDuration}</td>
  <td>{shift?.shiftPositions}</td>

  <td className='permissionButtons'> 

    {
      (isVolunteer && role ==='VOLUNTEER') &&
    
    <Row className='my-2'>
      <Col className='py-1'>
        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{signUpMessage}</Tooltip>}>
          <span className="d-inline-block">
            <Button name='signUpButton ' type='button' disabled={disableSignUpButton} onClick={handleSignUpShift} >Sign Up for shift!</Button>

        </span>
        </OverlayTrigger>


      </Col>

      <Col className='py-1'>
      <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{cancelMessage}</Tooltip>}>
          <span className="d-inline-block">
            <Button name='cancelButton ' type='button' disabled={disableCancelButton} onClick={handleCancelShift} >Cancel!</Button>

        </span>
        </OverlayTrigger>
      </Col>
    </Row>
   

   
    }
   
 
  </td>
  </>

)
}

export default EventShift