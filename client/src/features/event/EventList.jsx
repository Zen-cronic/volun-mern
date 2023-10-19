import React from 'react'
import { useGetEventsQuery } from './eventsApiSlice'
import EventExcerpt from './EventExcerpt'
import { Link } from 'react-router-dom'
import {Table, Container} from 'react-bootstrap'

const EventList = () => {

    const {data: events, isSuccess: isEventsSuccess, isLoading, isError, error } = useGetEventsQuery('eventsList', {

      //15min
        pollingInterval:900000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    let tableBodyContent

    if (isLoading) tableBodyContent = <p>Loading...</p>

    if (isError) {
        tableBodyContent = <p className="errmsg">{error?.data?.message}</p>
    }

    if(isEventsSuccess){

        const {ids} = events
        // console.log('all Events ids from useQUery:', ids);
        tableBodyContent = ids.map((eventId) => (

          <tr>
                <EventExcerpt key={eventId} eventId={eventId}/>
          </tr>
            
        ))
    }

    const content = (

      <>
      <div>
       <Link to={'/dash/events/new'}>Add new event</Link>
     </div>

   <Container className='my-2 px-3'>
       <Table striped bordered hover >

           <thead >
             <tr>
               <th scope='col'>Event Name</th>
               <th scope='col'>Venue</th>
               <th scope='col'>Description</th>
               <th scope='col'>When?</th>
               
             </tr>
           </thead>

           <tbody>
             {tableBodyContent}
           </tbody>
       </Table>
     </Container>
 </>
    )
  return content 
}

export default EventList