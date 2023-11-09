import React from 'react'
import { useState } from 'react';
import { useLazyPostSortedVolunteersQuery } from '../volunteersApiSlice';
import { useNavigate } from 'react-router';
import { Button, Form } from 'react-bootstrap';
import findingQueryTypes from '../../../config/findingQueryTypes';


const VolunSort = ({setFindingQuery}) => {

  
  const [sortOption, setSortOption] = useState('');
  const [sortVolunteers] = useLazyPostSortedVolunteersQuery()

  const navigate = useNavigate()

  const onSortOptionsChange = (e) => setSortOption(e.target.value)

  const sortOptionsSelect = (

      <Form.Select value={sortOption} name='sortSelect' onChange={onSortOptionsChange}>
         
          <option value={''}></option>
          <option value={'hours'}>By Volunteered Hours (from highest)</option>
          <option value={'volunteer_az'}>Alphabetically</option>

          
          
      </Form.Select>
  ) 

  const handleVolunSortSubmit = async( ) => {

    try {

      //needs a differnetly ordered arr with each new sort option
      const preferCacheValue = false
      const data = await sortVolunteers(sortOption, preferCacheValue).unwrap()

      console.log("unwrapped data from sortVolunteers front: ", data);

      navigate('/dash/volunteers/sort')

      setFindingQueryDisplay({
        findingQueryType: findingQueryTypes.SORT,
        findingQueryVal: sortOption
      })

    } catch (error) {
      console.error('handleVolunSort submit error: ', error);
    }
  }
  
  const sortSubmitButton = (

    <Button onClick={handleVolunSortSubmit}>Sort {sortOption}</Button>
   )

  return (
    <>
        {sortOptionsSelect}
        {sortSubmitButton}
    </>
  )
}

export default VolunSort