import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import findingQueryTypes from "../config/findingQueryTypes";


const useFindingQueryDisplayHook = () => {

    const [findingQuery, setFindingQuery] = useState({
        findingQueryType: "",
        findingQueryVal: "",
      });
    
      const [showFindingQuery, setShowFindingQuery] = useState(false);
    
      const location = useLocation();
    
      useEffect(() => {
    
        const displayQuery = Object.values(findingQueryTypes).some(
          (findingQueryType) => location.pathname.endsWith(`/${findingQueryType}`)
        );
    
        setShowFindingQuery(displayQuery);
        //jsut     setShowFindingQuery(displayQuery);
      }, [location]); //not dep on showFindingQuery
    
  return {findingQuery, showFindingQuery, setFindingQuery}
}

export default useFindingQueryDisplayHook