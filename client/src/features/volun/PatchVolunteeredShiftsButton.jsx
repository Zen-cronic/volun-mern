import React from 'react'
import { usePatchVolunteeredShiftsMutation } from './volunteersApiSlice'
import { Button } from 'react-bootstrap'

const PatchVolunteeredShiftsButton = () => {

    const [updateVolunteeredShifts, {isSuccess}] = usePatchVolunteeredShiftsMutation()

    const handleVolunteeredShifts = async() => {

        try {
          
          const data = await updateVolunteeredShifts().unwrap()


          window.location.reload(true)

          //not logged as page is reloaded
          console.log('return data from updateVolunteeredShifts from front: ', data)

        } catch (error) {
          console.log("updateVolunteeredShifts from front Error: ", error);
        }
    }

    const button = (

        <Button type='button'
                onClick={handleVolunteeredShifts}
            > Update Volunteered Shifts </Button>
    )
  return button
}

export default PatchVolunteeredShiftsButton