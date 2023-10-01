import React from 'react'
import { useState } from 'react';
import { useLazyPostSortedVolunteersQuery } from '../volunteersApiSlice';
import { useNavigate } from 'react-router';

const VolunSort = () => {

  
  const [sortOption, setSortOption] = useState('');
  const [sortVolunteers] = useLazyPostSortedVolunteersQuery()

  const navigate = useNavigate()

  const onSortOptionsChange = (e) => setSortOption(e.target.value)

  const sortOptionsSelect = (

      <select value={sortOption} name='sortSelect' onChange={onSortOptionsChange}>
         
          <option value={''}></option>
          <option value={'hours'}>By Volunteered Hours (from highest)</option>
          <option value={'volunteer_az'}>Alphabetically</option>

          
          
      </select>
  ) 

  const handleVolunSortSubmit = async( ) => {

    try {

      //needs a differnetly ordered arr with each new sort option
      const preferCacheValue = false
      const data = await sortVolunteers(sortOption, preferCacheValue).unwrap()

      console.log("unwrapped data from sortVolunteers front: ", data);

      navigate('/dash/volunteers/sort')

    } catch (error) {
      console.error('handleVolunSort submit error: ', error);
    }
  }
  
  const sortSubmitButton = (

    <button onClick={handleVolunSortSubmit}>Sort {sortOption}</button>
   )

  return (
    <>
        {sortOptionsSelect}
        {sortSubmitButton}
    </>
  )
}

export default VolunSort