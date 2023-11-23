
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice'
import jwtDecode from 'jwt-decode'

//if guest, all false/null
const useAuth = () => {

    const currentToken = useSelector(selectCurrentToken)

    let isVolunteer = false
    let isAdmin = false
    // let status = 'VOLUNTEER'
   
    if(currentToken){

        const decoded = jwtDecode(currentToken)

        const {volunId, role} = decoded.UserInfo

        if(role === 'ADMIN'){

            isAdmin = true
            // status =    'ADMIN'
            // return {volunId, role, isAdmin,isVolunteer}
        }

        else if(role === 'VOLUNTEER'){

            isVolunteer = true
            // return {volunId, role, isVolunteer, isAdmin,}
        }

        // else {
        //     role = 'UNKNOWN'
        // }
    
        return {volunId, role, isVolunteer, isAdmin}

        // else{
        //     throw new Error('User MUST BE EITHER ROLE')
        // }


    }

    

    return {volunId: '', role: '', isVolunteer, isAdmin}

}

export default useAuth