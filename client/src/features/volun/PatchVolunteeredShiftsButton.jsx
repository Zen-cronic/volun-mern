import React, { useEffect, useState } from "react";
import { usePatchVolunteeredShiftsMutation } from "./volunteersApiSlice";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//use modal + spinner to refresh data
const PatchVolunteeredShiftsButton = () => {
  const [
    updateVolunteeredShifts,
    { isSuccess: isPatchedSuccess, isLoading: isPatchedLoading },
  ] = usePatchVolunteeredShiftsMutation();

  // const [isPatched, setIsPatched] = useState(false);

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    if (isPatchedSuccess) {
      toast.success("Updated volunteered shifts successfully!");

      navigate("/dash");
    }
  }, [isPatchedSuccess, navigate]);

  const handlePatchVolunteeredShifts = async () => {
    try {
      const data = await updateVolunteeredShifts().unwrap();

      setShowModal(false);

      // console.log(
      //   "return data from updateVolunteeredShifts from front: ",
      //   data
      // );
    } catch (error) {
      console.log("updateVolunteeredShifts from front Error: ", error);
    }
  };

  return (
    <>
      <Button type="button" onClick={handleShowModal} variant="success">
        Update Volunteered Shifts
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p>Update volunteered shifts?</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirmation to update volunteered shifts</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Back
          </Button>
          <Button
            variant="success"
            onClick={handlePatchVolunteeredShifts}
            type="submit"
          >
            Update
            {isPatchedLoading && (
              <Spinner 
              variant="success" 
              role="status"
              as="span"
              animation="border"
              ></Spinner>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PatchVolunteeredShiftsButton;
