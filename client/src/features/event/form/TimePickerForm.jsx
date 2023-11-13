import { format } from 'date-fns';
import React , {useState} from 'react'
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import convertLocalDateToSameDateUTC from '../../../helpers/convertLocalDateToSameDateUTC';

//shift.shiftStart and shift.shiftEnd format: 'HH:mm'

const TimePickerForm = ({shift, updateShift, startOrEnd, eventDate}) => {

    const [selectedTime, setSelectedTime] = useState(new Date());
    const [time, setTime] = useState('')

 
    const displaySelectedTime = () => {

        if(shift.shiftStart && shift.shiftEnd){

          //shoudl be eventDate's date based on listId and parent ListId
          // const bufferDate= new Date()
          const parentDateForShift = convertLocalDateToSameDateUTC(eventDate.date)
     
          
          if(startOrEnd === 'start'){
            parentDateForShift.setHours(shift.shiftStart.split(':')[0])
            parentDateForShift.setMinutes(shift.shiftStart.split(':')[1])
          }

          if(startOrEnd === 'end'){
            parentDateForShift.setHours(shift.shiftEnd.split(':')[0])
            parentDateForShift.setMinutes(shift.shiftEnd.split(':')[1])
          }

          console.log("parentDateforShift TimePickerForm: ",parentDateForShift);
          return parentDateForShift
        }
       
      return selectedTime
  }
    // console.log('shiftTime of each timePIckerForm editEvent: ', shift);

    const timePickerForm = (

        <Form.Group controlId="shift" className='mb-3' >
        <DatePicker
           
    

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