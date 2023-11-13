import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSendLogOutMutation } from "../features/auth/authApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const [
    sendLogOut,
    { isSuccess: isLogOutSuccess, isError, error, isLoading },
  ] = useSendLogOutMutation();

  useEffect(() => {
    if (isLogOutSuccess) {
      //   toast.success("Logout successful as a side-effect");
      toast.success("Logout successful");
      navigate("/");
    }
  }, [isLogOutSuccess, navigate]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLogout = async () => {
    try {
      //   const deleteEventResult = await deleteEvent(eventId).unwrap();
      const data = await sendLogOut().unwrap();

      //   toast.success(data?.message ?? "Logout successful from handle");
      // console.log('data: ', data);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: {error?.data?.message}</p>;

  return (
    <>
      <Button variant="primary" type="button" onClick={handleShowModal}>
        Logout
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p>Logout now?</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirmation to Log out</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Back
          </Button>
          <Button
            variant="outline-primary"
            onClick={handleLogout}
            type="submit"
          >
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Logout;
