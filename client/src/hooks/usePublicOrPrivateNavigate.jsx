import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const usePublicOrPrivateNavigate = () => {

  const authObj = useAuth();

  // console.log('authObj from customHook: ', authObj);
  const navigate = useNavigate();

  const navigateFn =  (publicPathname) => {
    if (Object.values(authObj).every((val) => !Boolean(val))) {
      navigate(publicPathname);
    } else {
      navigate(`/dash${publicPathname}`);
    }
  };

  return navigateFn
};

export default usePublicOrPrivateNavigate;
