import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLazyPostSearchedVolunteersQuery } from '../volunteersApiSlice'

const VolunSearchBar = () => {

    const [searchParam, setSearchParam] = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParam? searchParam.get('q') : "")

    // const [searchTerm, setSearchTerm] = useState("")

    const navigate = useNavigate()

    const [searchVolunteers] = useLazyPostSearchedVolunteersQuery()
    const handleVolunSearchClick = async(e) => {

        e.preventDefault()

        if(!searchTerm){
            setSearchTerm("")
            return null
        }
        
        const encodedSearchTerm = encodeURI(searchTerm)
        

        try {
            
            const data  = await searchVolunteers(encodedSearchTerm, true).unwrap()

            console.log('unwrapped data from postSearchVolunQuery: ', data);

            // navigate(`/dash/volunteers/search?q=${encodedSearchTerm}` )
           
            // navigate(`/dash/volunteers/search` )

            setSearchParam(param => {

                param.set('q', encodedSearchTerm)
                return param
            })

            navigate(`/dash/volunteers/search?${searchParam}` )

        } catch (error) {
            console.error('searchVolun front error: ', error);
        }
    }
  return (
    <form onSubmit={handleVolunSearchClick}>
        <input
            type='text'
            value={searchTerm ?? ""}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='type volun name...'
        />
        <button type='submit'>Search</button>
    </form>
  )
}

export default VolunSearchBar