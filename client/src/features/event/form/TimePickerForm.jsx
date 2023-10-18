import { format } from 'date-fns';
import React , {useState} from 'react'
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';

const TimePickerForm = ({shift, updateShift, startOrEnd}) => {

    const [selectedTime, setSelectedTime] = useState(new Date());
    const [time, setTime] = useState('')

    // const filterPassedTime = (time) => {
    //   const currentDate = new Date();
    //   const selectedDateTime = new Date(time);
  
    //   return currentDate.getTime() < selectedDateTime.getTime();
    // };

    console.log('shiftTime of each timePIckerForm editEvent: ', shift);

    const timePickerForm = (

        <Form.Group controlId="shift" className='mb-3' >
        <DatePicker
           
            selected={selectedTime} 
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
          // filterTime={filterPassedTime}
          />
          
        </Form.Group>
    )
  return timePickerForm
}

export default TimePickerForm