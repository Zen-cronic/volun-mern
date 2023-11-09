import { useState } from "react";

const useModal = () => {

  const [isDisplayed, setIsDisplayed] = useState(false);

  const showModal = () => setIsDisplayed(true);
  const hideModal = () => setIsDisplayed(false);

  return { isDisplayed, showModal, hideModal};
};

export default useModal;
