import { format } from 'date-fns';
import React, { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import { Form } from 'react-bootstrap';
import convertLocalDateToSameDateUTC from '../../../helpers/convertLocalDateToSameDateUTC';

const DatePickerForm = ({eventDate, updateEvent, eventId}) => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateStr, setDateStr] = useState('')

   console.log('eventDate of each datePIckerForm editEvent: ', eventDate);
 
    const datePickerForm = (

        <Form.Group controlId="eventDate" className='mb-3' >
        <DatePicker 
            showIcon={true}
            // selected={selectedDate} 
            // selected={new Date(eventDate)} 
           
          //  new Date(eventDate.date) turns localDate into UTC
            // selected={new Date(eventDate.date).setDate(new Date(eventDate.date).getDate() + 1)}
            
         //DNW cuz onClikc newDate - eventDate.date is formatted with T00:00   
            // selected={eventDate.date ? 
            //   convertLocalDateToSameDateUTC(eventDate.date) 
            //   :
            //   selectedDate} 

              selected={eventDate.date
              ? 
              convertLocalDateToSameDateUTC(eventDate.date)
              // new  Date(eventDate.date)
              : selectedDate}
    
      //reFactor for NewEventForm


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