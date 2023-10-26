import React, {useState} from 'react'
import useAuth from '../../hooks/useAuth';
import { selectVolunteerById, useGetUserByIdQuery, useLazyPostCheckButtonsQuery, usePatchCancelShiftMutation, usePatchSignedUpShiftMutation } from '../volun/volunteersApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const EventShift = ({shift, eventId}) => {

  const {role, isVolunteer, volunId} = useAuth()

  // const [reloadPage, setReloadPage] = useState(false)

  const shiftId = shift?._id

  const [disableSignUpButton, setDisableSignUpButton] = useState(false)
  const [disableCancelButton, setDisableCancelButton] = useState(false);
  const [signUpShift,] = usePatchSignedUpShiftMutation()
  const [cancelShift,] =usePatchCancelShiftMutation()

  //canNOT use memoized selector for volunteer - /users isNOT memoized
  // const volunteer = useSelector(state => selectVolunteerById(state, volunId))

  const [checkButton] = useLazyPostCheckButtonsQuery()

  console.log('shiftId: ', shiftId);

  useEffect(() => {
    
    const disableSignUpButton = async()=>{

      //try Promise.all for both buttons
      try {

        const [updatableData, cancelableData] = await Promise.all([
         checkButton({eventId, shiftId, volunId, buttonType: 'signup'}).unwrap(), 
         checkButton({eventId, shiftId, volunId, buttonType: 'cancel'}).unwrap()])


        console.log('return updatabledata from checkButton from front: ', updatableData);
        console.log('return cancelableData from checkButton from front: ', cancelableData);

        const {disable: disableUpdate, message} = updatableData
        const {disable: disableCancel, message: cancelMessage} = cancelableData
  
        setDisableSignUpButton(disableUpdate)
        setDisableCancelButton(disableCancel)
  
      } catch (error) {
        console.log('disableSignUpButton error: ', error);
      }
    }

    disableSignUpButton()
  }, []);
  
  
  
  const handleSignUpShift = async () => {

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

    try {
      
      const data = await cancelShift({eventId, shiftId, volunId}).unwrap()

      //not logged as page is reloaded, only the onQueryStartred is logged
      console.log('return data from cancelShift from front: ', data)

      window.location.reload(true)


    } catch (error) {
      console.log("cancelShift from front Error: ", error);
    }
  }



return (    <li key={shiftId}>

  <p>Shift Start: {shift.localShiftStart}</p>
  <p>Shift End: {shift.localShiftEnd}</p>
  <p>open shift poistion: {shift.shiftPositions}</p>

  <p className='permissionButtons'> 

    {
      (isVolunteer && role ==='VOLUNTEER') &&
    <>
    <button className='signUpButton' type='button' disabled={disableSignUpButton} onClick={handleSignUpShift}>Sign Up for shift!</button>
      <button className='cancelSignUp' type='button' disabled={disableCancelButton} onClick={handleCancelShift}>Cancel shift</button>

    </>
    }
   
 
  </p>
</li>)
}

export default EventShift