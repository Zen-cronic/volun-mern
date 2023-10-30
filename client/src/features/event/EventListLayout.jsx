import React from 'react'
import { Container, Table } from 'react-bootstrap'

const EventListLayout = ({tableBodyContent}) => {


    return (
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

    )
}
export default EventListLayout