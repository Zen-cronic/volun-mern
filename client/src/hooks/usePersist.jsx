
import React, {useState, useEffect} from 'react'

const usePersist = () => {

    const localStoragePersist = JSON.parse(localStorage.getItem('persist'))
    const [persist, setPersist] = useState(localStoragePersist || false);

    useEffect(() => {
        
        localStorage.setItem('persist', JSON.stringify(persist))

    }, [persist]);
 
    return [persist, setPersist]
}

export default usePersist