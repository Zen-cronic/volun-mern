import React from 'react'
import { Container, Table } from 'react-bootstrap'

const VolunteersListLayout = ({tableBodyContent}) => {


    return (

    <Container className='my-2 px-3'>
       <Table striped bordered hover responsive >

           <thead >
             <tr>
               <th scope='col' >Name</th>
               <th scope='col' >Student ID</th>
               <th scope='col' style={{width: '30%'}}>Total volunteered hours</th>
               
             </tr>
           </thead>

           <tbody>
             {tableBodyContent}
           </tbody>
       </Table>
     </Container>

    )
}
export default VolunteersListLayout