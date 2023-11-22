import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import PublicHeader from './PublicHeader'
import { ToastContainer } from 'react-toastify'
import PublicFooter from './PublicFooter'

const Layout = () => {

    const {volunId, role}= useAuth()

    const displayPublic = !volunId  && !role

    return (
    
        <body className='d-flex flex-column min-vh-100'>
            {displayPublic && <PublicHeader/>}
            <main className=' flex-grow-1'>
            <ToastContainer/>
           
            <Outlet/>
            </main>
            
            
            {displayPublic && <PublicFooter/>}
        </body>
   )
}
export default Layout