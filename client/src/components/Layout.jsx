import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import PublicHeader from './PublicHeader'
import { ToastContainer } from 'react-toastify'

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