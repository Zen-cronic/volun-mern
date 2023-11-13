import React from "react";
import useAuth from "../../hooks/useAuth";
import {
  usePatchCancelShiftMutation,
  usePatchSignedUpShiftMutation,
} from "../volun/volunteersApiSlice";
import {
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import convertShiftDisplayDateTime from "../../helpers/convertShiftDisplayDateTime";
import useDisableButtonsHook from "../../hooks/useDisableButtonsHook";
import useModal from "../../hooks/useModal";

const EventShift = ({ shift, eventId }) => {
  
  const { role, isVolunteer, volunId } = useAuth();

  const shiftId = shift?._id;

  const {
    disableCancelButton,
    setDisableCancelButton,
    disableSignUpButton,
    setDisableSignUpButton,
    signUpMessage,
    cancelMessage,
  } = useDisableButtonsHook(shiftId, eventId, volunId, role, isVolunteer);

  const signUpModal = useModal();
  const cancelModal = useModal();

  const [signUpShift] = usePatchSignedUpShiftMutation();
  const [cancelShift] = usePatchCancelShiftMutation();

  const handleSignUpShift = async () => {
    if (disableSignUpButton) {
      return;
    }

    try {
      const data = await signUpShift({ eventId, shiftId, volunId }).unwrap();

      console.log("return data from updateSignUPShift from front: ", data);

      setDisableSignUpButton(true);
      // setShowSignUpModal(false);
      signUpModal.showModal();
    } catch (error) {
      console.log("updateSignUPShift from front Error: ", error);
    }
  };

  const handleCancelShift = async () => {
    if (disableCancelButton) {
      return;
    }

    try {
      const data = await cancelShift({ eventId, shiftId, volunId }).unwrap();
      console.log("return data from cancelShift from front: ", data);

      setDisableCancelButton(true);
      // setShowCancelModal(false);

      cancelModal.showModal();
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
                    onClick={signUpModal.showModal}
                  >
                    Sign Up for shift!
                  </Button>

                  <Modal
                    show={signUpModal.isDisplayed}
                    onHide={signUpModal.hideModal}
                  >
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
                        onClick={signUpModal.hideModal}
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
                    onClick={cancelModal.showModal}
                  >
                    Cancel!
                  </Button>

                  <Modal
                    show={cancelModal.isDisplayed}
                    onHide={cancelModal.hideModal}
                  >
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
                        onClick={cancelModal.hideModal}
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
