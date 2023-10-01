import React from 'react'
import './App.css'
import {createBrowserRouter, Route, Routes} from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import Prefetch from './features/auth/Prefetch'
import EventHeader from './features/event/EventHeader'
import EventList from './features/event/EventList'
import EventPage from './features/event/EventPage'
import EditEventForm from './features/event/EditEventForm'
import NewEventForm from './features/event/NewEventForm'
import FilteredEventList from './features/event/filter/FilteredEventList'
import SortedEventsList from './features/event/sort/SortedEventsList'
import SearchedEventsList from './features/event/search/SearchedEventsList'
import VolunteerHeader from './features/volun/VolunteerHeader'
import VolunteersList from './features/volun/VolunteersList'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import RequireAuth from './features/auth/RequireAuth'
import EventStats from './features/event/EventStats'
import SearchedVolunList from './features/volun/search/SearchedVolunList'
import SortedVolunList from './features/volun/sort/SortedVolunList'
import SingleVolunteerPage from './features/volun/SingleVolunteerPage'

const App = () => {
  return (
    <Routes>

      <Route path='/' element={<Layout/>}>
          <Route index={true} element={<Public/>}/>

          <Route path='/login' element={<Login/>}/>

          <Route element={<Prefetch/>}>

            <Route path='/dash' element={<DashLayout/>}>

              <Route index={true} element={<Welcome/>}/>
              <Route path='events' element={<EventHeader/>}>

                  <Route index={true} element={<EventList/>}/>
                  {/* <Route path=':eventId' element={<EventPage/>}>
                      <Route path='edit' element={<EditEventForm/>}/>
                      
                  </Route> */}

                  <Route path=':eventId'>
                      <Route index element={<EventPage/>}/>

                  {/* <Route path=':eventId' element={<EventPage/>}> */}

                      <Route element={<RequireAuth allowedRole={"ADMIN"}/>}>
                        <Route path='edit' element={<EditEventForm/>}/>
                        <Route path='stats' element={<EventStats/>}/>
                        <Route path='new' element={<NewEventForm/>}/>

                      </Route>
                  </Route>

                
                  <Route path='filter' element={<FilteredEventList/>}/>

                  <Route path='sort' element={<SortedEventsList/>}/>

                  <Route path='search' element={<SearchedEventsList/>}/>

                



              </Route>

                  {/* prefetchVOluns here */}
                  {/* RequireAuth for admin only */}
              {/* <Route element={<RequireAuth allowedRole={"ADMIN"}/>}> */}
                <Route path='volunteers' element={<VolunteerHeader/>}>
                  <Route element={<RequireAuth allowedRole={"ADMIN"}/>}>
                    <Route index={true} element={<VolunteersList/>}/>

                    {/* <Route path=':volunId'>

                    </Route> */}

                    <Route path='search' element={<SearchedVolunList/>}/>

                    <Route path='sort' element={<SortedVolunList/>}/>

                </Route>  

                 <Route element={<RequireAuth allowedRole={"VOLUNTEER"}/>}>

                    <Route path=':volunId' element={<SingleVolunteerPage/>}/>
                 </Route>

              </Route>

            </Route>

            
          </Route>


      </Route>
    </Routes>
  )
}

export default App