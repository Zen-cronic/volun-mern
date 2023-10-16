import { format } from 'date-fns';
import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';

const DatePickerForm = ({eventDate, updateEvent}) => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateStr, setDateStr] = useState('')

    const datePickerForm = (

        <Form.Group controlId="eventDate" className='mb-3' >
        <DatePicker 
          showIcon={true}
            selected={selectedDate} 
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            onChange={date =>
            
               {
       
    
                const formattedlocalDate = format(date, 'yyyy-MM-dd').concat('T00:00')
    
                console.log('formattedlocalDate: ', formattedlocalDate);

                setSelectedDate(date)
                setDateStr(formattedlocalDate)
               
                updateEvent({...eventDate, date: formattedlocalDate})
                // updateEventAndShift({...eventDate, date: dateStr})
               } 
               }
         
            
            
          />
          
        </Form.Group>
       
      )

   
  return datePickerForm
}

export default DatePickerForm