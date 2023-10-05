import React, {useState} from 'react'
import useAuth from '../../hooks/useAuth';
import { selectVolunteerById, useGetUserByIdQuery, usePatchCancelShiftMutation, usePatchSignedUpShiftMutation } from '../volun/volunteersApiSlice';
import { useSelector } from 'react-redux';

const EventShift = ({shift, eventId}) => {

  const {role, isVolunteer, volunId} = useAuth()

  // const [reloadPage, setReloadPage] = useState(false)

  const shiftId = shift?._id

  const [disableSignUp, setDisableSignUp] = useState(false)

  const [signUpShift,] = usePatchSignedUpShiftMutation()
  const [cancelShift,] =usePatchCancelShiftMutation()

  //canNOT use memoized selector for volunteer - /users isNOT memoized
  // const volunteer = useSelector(state => selectVolunteerById(state, volunId))

  // if(volunteer){

  //   const {signedUpShifts} = volunteer

  //   console.log('selected volunteer from eventShift: ', volunteer)
    
  //   const alreadySignedUp = signedUpShifts.find(id => id.toString() === shiftId.toString())

  //   if(alreadySignedUp){
  //     setDisableSignUp(true)
  //   }
  // }


  //infinite rerendering
  const {data: user, isSuccess: isVolunteerDataSuccess, isLoading, isError, error} = useGetUserByIdQuery(volunId)

  if(isVolunteerDataSuccess){
  
      
    const {entities} = user
    const volunteer = entities[volunId]

    const {signedUpShifts} = volunteer

    console.log('selected volunteer from eventShift: ', volunteer)

    const alreadySignedUp = signedUpShifts.find(id => id.toString() === shiftId.toString())

    if(alreadySignedUp){
      setDisableSignUp(true)
    }
  }


  console.log('shiftId: ', shiftId);

  
  
  const handleSignUpShift = async () => {

    try {
      
      const data = await signUpShift({eventId, shiftId, volunId}).unwrap()

      console.log('return data from updateSignUPShift from front: ', data)

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

      // if(isCancelSuccess){
      //   // location.reload(true)
      //   console.log('cancelled event');
      //   window.location.replace('/dash/events')
      // }

      window.location.reload(true)
      // location.reload(true)

      // setReloadPage(true)

    } catch (error) {
      console.log("cancelShift from front Error: ", error);
    }
  }


  // const handleViewSignedUpVolunteers = async() => {

  //   // try {
  //   //   const data = await getSignedUpVolunteers({eventId}).unwrap()

  //   //   console.log('untransformed data for getSignedupVolkun from front: ', data);
  //   // } catch (error) {
  //   //   console.log('getSIgnedUPVolun front error: ', error);
  //   // }

  //     navigate('/dash/events/')
  // }


  // const volunId = 
return (    <li key={shiftId}>

  <p>Shift Start: {shift.localShiftStart}</p>
  <p>Shift End: {shift.localShiftEnd}</p>
  <p>open shift poistion: {shift.shiftPositions}</p>

  {/* each shift volun here */}
  {/* <p>shiftVolunteers: {shift.signedUpVolunteers}</p> */}

  <p className='permissionButtons'> 

    {
      (isVolunteer && role ==='VOLUNTEER') &&
    <>
    <button className='signUpButton' type='button' disabled={disableSignUp} onClick={handleSignUpShift}>Sign Up for shift!</button>
      <button className='cancelSignUp' type='button' disabled={true} onClick={handleCancelShift}>Cancel shift</button>

    </>
    }
   
 
  </p>
</li>)
}

export default EventShift