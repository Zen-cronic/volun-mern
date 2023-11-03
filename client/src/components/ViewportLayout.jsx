import React from 'react'
import { Outlet } from 'react-router-dom'

const ViewportLayout = () => {


  return (


     <div style={{minHeight:'100vh'}}>
      <Outlet/>
    </div> 

    // <Outlet/>
  )
}

export default ViewportLayout