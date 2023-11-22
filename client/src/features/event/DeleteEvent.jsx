import React, { useEffect, useState } from "react";
import { useDeleteEventMutation } from "./eventsApiSlice";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {FaTrashAlt} from 'react-icons/fa'

const DeleteEvent = ({ eventId }) => {
  const [deleteEvent, { isSuccess, isLoading, isError, error }] =
    useDeleteEventMutation();

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Event deleted successfully");
      navigate("/dash/events");
    }
  }, [isSuccess, navigate]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDeleteEvent = async () => {
    try {
      const deleteEventResult = await deleteEvent({eventId}).unwrap();

      console.log("deleteEventResult: ", deleteEventResult);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <>
      <Button variant="danger" type="button" onClick={handleShowModal}>
        Delete
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p>Delete this event?</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirmation to delete event</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Back
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteEvent}
            type="submit"
          >

            <FaTrashAlt/>
          
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteEvent;
