import React from 'react'
import useAuth from '../../hooks/useAuth';
import { usePatchCancelShiftMutation, usePatchSignedUpShiftMutation } from '../volun/volunteersApiSlice';

const EventShift = ({shift, eventId}) => {

  const {role, isVolunteer, volunId} = useAuth()

  // const [getSignedUpVolunteers, {dta}] = useLazyGetSignedUpVolunteersQuery()
  const shiftId = shift?._id

  const [signUpShift] = usePatchSignedUpShiftMutation()
  const [cancelShift] =usePatchCancelShiftMutation()

  // const navigate = useNavigate(
  console.log('shiftId: ', shiftId);
  // console.log('volunId from useAuth: ', volunId  );
  // console.log('eventId from EventPage: ', eventId);

  const handleSignUpShift = async () => {

    try {
      
      const data = await signUpShift({eventId, shiftId, volunId}).unwrap()

      console.log('return data from updateSignUPShift from front: ', data)

    } catch (error) {
      console.log("updateSignUPShift from front Error: ", error);
    }
  }

  const handleCancelShift = async()=>{

    try {
      
      const data = await cancelShift({eventId, shiftId, volunId}).unwrap()

      console.log('return data from cancelShift from front: ', data)


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

  {/* updatre and canccel for volun */}

    {
      (isVolunteer && role ==='VOLUNTEER') &&
    <>
    <button className='signUpButton' type='button' onClick={handleSignUpShift}>Sign Up for shift!</button>
      <button className='cancelSignUp' type='button' onClick={handleCancelShift}>Cancel shift</button>

    </>
    }

     {/* {
      (isAdmin && role==='ADMIN') && 
        <>
        <button>Edit for admin</button>
        <button type='button' onClick={handleViewSignedUpVolunteers}>See signedUPVolunteers for admin</button>
        </>
     } */}
   
 
  </p>
</li>)
}

export default EventShift