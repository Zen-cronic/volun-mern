import { useEffect } from "react";
import { useLazyPostCheckButtonsQuery,  } from "../features/volun/volunteersApiSlice";
import { useState } from "react";


const useDisableButtonsHook = (shiftId, eventId, volunId, role, isVolunteer) => {


    const [disableSignUpButton, setDisableSignUpButton] = useState(false);
    const [disableCancelButton, setDisableCancelButton] = useState(false);
  
    const [signUpMessage, setSignUpMessage] = useState("");
    const [cancelMessage, setCancelMessage] = useState("");

    //canNOT use memoized selector for volunteer - /users isNOT memoized
  
    const [checkButton] = useLazyPostCheckButtonsQuery();
  
    useEffect(
      () => {
        const disableButtons = async () => {
          //try Promise.all for both buttons
          try {
            const [updatableData, cancelableData] = await Promise.all([
              checkButton({
                eventId,
                shiftId,
                volunId,
                buttonType: "signup",
              }).unwrap(),
              checkButton({
                eventId,
                shiftId,
                volunId,
                buttonType: "cancel",
              }).unwrap(),
            ]);
  
            console.log(
              "return updatabledata from checkButton from front: ",
              updatableData
            );
            console.log(
              "return cancelableData from checkButton from front: ",
              cancelableData
            );
  
            const { disable: disableUpdate, message: signUpMsg } = updatableData;
            const { disable: disableCancel, message: cancelMsg } = cancelableData;
  
            setDisableSignUpButton(disableUpdate);
            setDisableCancelButton(disableCancel);
  
            setSignUpMessage(signUpMsg);
            setCancelMessage(cancelMsg);
          } catch (error) {
            console.log("disableSignUpButton error: ", error);
          }
        };
  
        if (isVolunteer && role === "VOLUNTEER") {
          disableButtons();
        }
      },
      [disableSignUpButton, disableCancelButton]
    );
  
  return {disableCancelButton, disableSignUpButton, signUpMessage, cancelMessage, setDisableCancelButton, setDisableSignUpButton}
    
}

export default useDisableButtonsHook