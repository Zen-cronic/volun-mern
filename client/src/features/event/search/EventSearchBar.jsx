import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetEventsQuery, useLazyPostSearchedEventsQuery } from '../eventsApiSlice'
import { Button, Form } from 'react-bootstrap'

const EventSearchBar = () => {

   const [searchParams, setSearchParams] = useSearchParams()

   
   const [searchQuery, setSearchQuery] = useState(searchParams? searchParams.get('q') : null)

   const [searchEvent] = useLazyPostSearchedEventsQuery()
  const navigate = useNavigate()
  
   const handleSearchSubmit = async (e) => {

    e.preventDefault()

    if(!searchQuery){

      setSearchParams("")
      return null
  }
  const encodedSearchQuery = encodeURI(searchQuery|| "")
    try {
      
      const preferCacheValue = true
      const {data} = await searchEvent(searchQuery,preferCacheValue)

      navigate('/dash/events/search?q=' + encodedSearchQuery)


      console.log("Searched events data: ", data);
    } catch (error) {
        console.error('events search error: ', error);
    }
   }
   const searchBar = (

    <Form onSubmit={handleSearchSubmit}>
        <Form.Control  
          type='text'
          value={searchQuery ?? ""}
          onChange={e => setSearchQuery(e.target.value)}
        />

  <Button type="submit">Search</Button>
    </Form>

    
   )
  return searchBar
}

export default EventSearchBar