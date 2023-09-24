import React from 'react'
import DashHeader from './DashHeader'
import { Outlet } from 'react-router'
import DashFooter from './DashFooter'

const DashLayout = () => {
  return (
    <>
        <DashHeader/>
        <Outlet/>
        <DashFooter/>
    </>
  )
}

export default DashLayout