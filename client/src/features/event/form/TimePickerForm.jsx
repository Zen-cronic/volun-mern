import { format } from 'date-fns';
import React , {useState} from 'react'
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';

//shift.shiftStart and shift.shiftEnd format: 'HH:mm'

const TimePickerForm = ({shift, updateShift, startOrEnd}) => {

    const [selectedTime, setSelectedTime] = useState(new Date());
    const [time, setTime] = useState('')

 
    const displaySelectedTime = () => {

        if(shift.shiftStart && shift.shiftEnd){

          const bufferDate = new Date()

          if(startOrEnd === 'start'){
            bufferDate.setHours(shift.shiftStart.split(':')[0])
            bufferDate.setMinutes(shift.shiftStart.split(':')[1])
          }

          if(startOrEnd === 'end'){
            bufferDate.setHours(shift.shiftEnd.split(':')[0])
            bufferDate.setMinutes(shift.shiftEnd.split(':')[1])
          }

          return bufferDate
        }
       
      return selectedTime
  }
    // console.log('shiftTime of each timePIckerForm editEvent: ', shift);

    const timePickerForm = (

        <Form.Group controlId="shift" className='mb-3' >
        <DatePicker
           
            // selected={displaySelectedTime} 
            // selected={
            //     (shift.shiftStart && shift.shiftEnd)
            //     ?
            //     displaySelectedTime()
            //     :
            //     selectedTime} 

            selected={displaySelectedTime()}
            onChange={date =>
            
               {
       
    
                const formattedlocalTime= format(date, 'HH:mm')
    
                console.log('formattedlocalDate: ', formattedlocalTime);

                setSelectedTime(date)
                setTime(formattedlocalTime)
               
               if(startOrEnd === 'start'){
                updateShift({...shift, shiftStart: formattedlocalTime})
               }
               else if(startOrEnd === 'end'){
                updateShift({...shift, shiftEnd: formattedlocalTime})
               }

               } 
               }
 
            showTimeSelect
            showTimeSelectOnly
            
            timeIntervals={30}
          timeCaption="Time"
          dateFormat="hh:mm aa"
          
       
          timeFormat='hh:mm aa'
       
          />
          
        </Form.Group>
    )
  return timePickerForm
}

export default TimePickerForm