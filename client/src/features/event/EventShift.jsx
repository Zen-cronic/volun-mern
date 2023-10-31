import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  useLazyPostCheckButtonsQuery,
  usePatchCancelShiftMutation,
  usePatchSignedUpShiftMutation,
} from "../volun/volunteersApiSlice";
import { useEffect } from "react";
import {
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import convertShiftDisplayDateTime from "../../helpers/convertShiftDisplayDateTime";

import "react-toastify/dist/ReactToastify.css";

const EventShift = ({ shift, eventId }) => {
  const { role, isVolunteer, volunId } = useAuth();

  const shiftId = shift?._id;

  const [disableSignUpButton, setDisableSignUpButton] = useState(false);
  const [disableCancelButton, setDisableCancelButton] = useState(false);

  const [signUpMessage, setSignUpMessage] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  const [signUpShift] = usePatchSignedUpShiftMutation();
  const [cancelShift] = usePatchCancelShiftMutation();

  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleShowSignUpModal = () => setShowSignUpModal(true);
  const handleCloseSignUpModal = () => setShowSignUpModal(false);

  const handleShowCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => setShowCancelModal(false);

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
    // [disableSignUpButton, disableCancelButton, signUpMessage, cancelMessage]
    [disableSignUpButton, disableCancelButton]
  );

  const handleSignUpShift = async () => {
    if (disableSignUpButton) {
      return;
    }

    try {
      const data = await signUpShift({ eventId, shiftId, volunId }).unwrap();

      console.log("return data from updateSignUPShift from front: ", data);

      setDisableSignUpButton(true);
      setShowSignUpModal(false);
    } catch (error) {
      console.log("updateSignUPShift from front Error: ", error);
    }
  };

  const handleCancelShift = async () => {
    if (disableCancelButton) {
      return;
    }

    // setShowModal(true);
    try {
      const data = await cancelShift({ eventId, shiftId, volunId }).unwrap();

      //not logged as page is reloaded, only the onQueryStartred is logged
      console.log("return data from cancelShift from front: ", data);

      // window.location.reload(true);

      setDisableCancelButton(true);
      setShowCancelModal(false);
    } catch (error) {
      console.log("cancelShift from front Error: ", error);
    }
  };

  return (
    <>
      <td>{convertShiftDisplayDateTime(shift?.localShiftStart)}</td>
      <td>{convertShiftDisplayDateTime(shift?.localShiftEnd)}</td>
      <td>{shift?.shiftDuration}</td>
      <td>{shift?.shiftPositions}</td>
      {isVolunteer && role === "VOLUNTEER" && (
        <td>
          <Row className="my-2">
            <Col className="py-1">
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">{signUpMessage}</Tooltip>
                }
              >
                <span className="d-inline-block">
                  <Button
                    name="signUpButton "
                    type="button"
                    disabled={disableSignUpButton}
                    onClick={handleShowSignUpModal}
                  >
                    Sign Up for shift!
                  </Button>

                  <Modal show={showSignUpModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Sign up?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {/* display shift info */}
                      Confirm to sign up for this shift
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseSignUpModal}
                      >
                        Back
                      </Button>
                      <Button variant="primary" onClick={handleSignUpShift}>
                        Sign up
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </span>
              </OverlayTrigger>
            </Col>

            <Col className="py-1">
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">{cancelMessage}</Tooltip>
                }
              >
                <span className="d-inline-block">
                  <Button
                    name="cancelButton "
                    type="button"
                    disabled={disableCancelButton}
                    onClick={handleShowCancelModal}
                  >
                    Cancel!
                  </Button>

                  <Modal show={showCancelModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Cancel Shift?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {/* display shift info */}
                      Confirm to cancel your shift
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseCancelModal}
                      >
                        Back
                      </Button>
                      <Button variant="primary" onClick={handleCancelShift}>
                        Cancel Shift
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </span>
              </OverlayTrigger>
            </Col>
          </Row>
        </td>
      )}
    </>
  );
};

export default EventShift;
