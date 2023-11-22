import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const usePublicOrPrivateNavigate = () => {

  const authObj = useAuth();

  const navigate = useNavigate();

  const navigateFn =  (publicPathname) => {
    if (!Object.values(authObj).every((val) => val)) {
      navigate(publicPathname);
    } else {
      navigate(`/dash${publicPathname}`);
    }
  };

  return navigateFn
};

export default usePublicOrPrivateNavigate;
