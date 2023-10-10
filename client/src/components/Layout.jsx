import { ToastContainer } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import PublicHeader from './PublicHeader'

const Layout = () => {

    const {volunId, role}= useAuth()

    const displayPublicHeader = !volunId && !role

    return (
    
        <>
            {displayPublicHeader && <PublicHeader/>}
            <ToastContainer/>
            <Outlet />
        </>
   )
}
export default Layout