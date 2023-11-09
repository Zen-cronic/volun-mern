import React, { useEffect, useState } from 'react'
import { usePatchVolunteeredShiftsMutation } from './volunteersApiSlice'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

//use modal + spinner to refresh data
const PatchVolunteeredShiftsButton = () => {

    const [updateVolunteeredShifts, {isSuccess: isPatchedSuccess}] = usePatchVolunteeredShiftsMutation()

    const [isPatched, setIsPatched] = useState(false);

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
      
      if(isPatchedSuccess){
        navigate(location)
      }

    }, [isPatched, navigate]);
    const handleVolunteeredShifts = async() => {

        try {
          
          const data = await updateVolunteeredShifts().unwrap()



          // window.location.reload(true)
          setIsPatched(true)

          //not logged as page is reloaded
          console.log('return data from updateVolunteeredShifts from front: ', data)

        } catch (error) {
          console.log("updateVolunteeredShifts from front Error: ", error);
        }
    }

    const button = (

        <Button type='button'
                onClick={handleVolunteeredShifts}
                variant='success'
            > Update Volunteered Shifts </Button>
    )
  return button
}

export default PatchVolunteeredShiftsButton