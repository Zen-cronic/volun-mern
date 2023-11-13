import React from 'react'
import { Button , Modal} from 'react-bootstrap'

const ConfirmationEventModal = ({handleFormSubmit, title, children, showModal, handleCloseModal, confirmButtonText}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      
      {children}

    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
        Back
      </Button>
      <Button variant="primary" onClick={handleFormSubmit} type="submit">
        {confirmButtonText}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default ConfirmationEventModal