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
            onChange={date =>
            
               {
       
    
                const formattedlocalDate = format(date, 'yyyy-MM-dd')
    
                console.log('formattedlocalDate: ', formattedlocalDate);

                setSelectedDate(date)
                setDateStr(formattedlocalDate)
               
                updateEvent({...eventDate, date: formattedlocalDate})
                // updateEventAndShift({...eventDate, date: dateStr})
               } 
               }
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            
            
          />
          
        </Form.Group>
       
      )

   
  return datePickerForm
}

export default DatePickerForm