import React, { useState, useEffect } from "react";
import AddEventDateAndShiftTime from "./AddEventDateAndShiftTime";
import { usePostNewEventMutation } from "../eventsApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import isValidNumberInput from "../../../helpers/isValidNumberInput";
import {
  Container,
  Row,
  Form,
  Stack,
  Col,
  FloatingLabel,
  Button,
  Modal,
} from "react-bootstrap";
import filterNonDuplicate from "../../../helpers/filterNonDuplicate";
import ConfirmationEventModal from "./ConfirmationEventModal";

const NewEventForm = () => {
  const [listId, setListId] = useState(1);
  const [shiftListId, setShiftListId] = useState(1 * 100);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: "",
    eventVenue: "",
    eventDates: [],
    eventDescription: "",
    shifts: [],
  });

  const [createNewEvent, { isSuccess, isLoading }] = usePostNewEventMutation();

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    // console.log('aft changes in formData.eventDates: ', formData.eventDates);
    // console.log('aft changes in formData.shifts: ', formData.shifts);

    if (isSuccess) {
      setFormData({
        eventName: "",
        eventVenue: "",
        eventDates: [],
        eventDescription: "",
        shifts: [],
      });

      toast.success("Event created successfully");

      navigate("/dash/events");
    }
  }, [isSuccess, navigate]);

  //onClick addEventDateAndSHift, both eventDates and shifts changes
  const addEventDateAndShift = () => {
    setFormData({
      ...formData,
      eventDates: [
        ...formData.eventDates,
        {
          listId: listId,
          date: "",
        },
      ],
      shifts: [
        ...formData.shifts,
        {
          shiftListId: shiftListId,
          shiftStart: "",
          shiftEnd: "",
          shiftPositions: "",
          parentListIdForShift: listId,
        },
      ],
    });

    console.log(
      "addEventandShift & parentListIdForShift listID: ",
      listId,
      " | shiftListId: ",
      shiftListId
    );

    setListId(listId + 1);
    setShiftListId(shiftListId + 1);
  };

  const updateEvent = (eventDateObj) => {
    const updatedEventDates = formData.eventDates.map((eventDate) => {
      if (eventDate.listId === eventDateObj.listId) {
        return eventDateObj;
      }

      //unmodified obj
      return eventDate;
    });

    setFormData({ ...formData, eventDates: updatedEventDates });
  };

  const updateShift = (shiftObj) => {
    const updatedShiftTimes = formData.shifts.map((shift) => {
      if (shiftObj.shiftListId === shift.shiftListId) {
        return shiftObj;
      }

      return shift;
    });

    setFormData({ ...formData, shifts: updatedShiftTimes });
  };

  const removeEventAndShift = (eventDateObj) => {
    console.log("tbremoved evetnDateObj: ", eventDateObj);
    if (formData.eventDates.length === 1) {
      console.log("min 1 date/shift");
      return null;
    }

    const updatedEventDates = formData.eventDates.filter(
      (eventDate) => eventDate.listId !== eventDateObj.listId
    );

    //[]remove shifts of that event too - for bcknd
    console.log("updatedShiftTimes w/o removing:  ", formData.shifts);

    //nu shiftObj can be mapped for AddEventDatesANdshiftTimes - only eventDateObj
    // const updatedShiftTimes = formData.shifts.filter(shift => shift.shiftListId !== shiftObj.shiftListId)

    const updatedShiftTimes = formData.shifts.filter(
      (shift) => shift.parentListIdForShift !== eventDateObj.listId
    );

    setFormData({
      ...formData,

      eventDates: updatedEventDates,
      shifts: updatedShiftTimes,
    });
  };

  const renderEventDatesAndShifts = formData.eventDates.map((eventDate) => {
    const correspondingShift = formData.shifts.find(
      (shift) => shift.parentListIdForShift === eventDate.listId
    );

    return (
      <AddEventDateAndShiftTime
        key={eventDate.listId}
        // key={Math.random(2)}

        listId={listId - 1}
        eventDate={eventDate}
        removeEventAndShift={removeEventAndShift}
        updateEvent={updateEvent}
        updateShift={updateShift}
        shift={correspondingShift}
        shiftListId={shiftListId - 1}
      />
    );
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    //mini input validation
    if (
      formData.shifts.some((shift) => !isValidNumberInput(shift.shiftPositions))
    ) {
      toast.error(
        "Please enter a valid number greater than 0 for shift positions"
      );
      return;
    }

    //data format for back
    const modifiedEventDates = filterNonDuplicate(
      formData.eventDates.map((eventDate) => eventDate.date)
    );

    const modifiedShifts = formData.shifts.map((shift) => {
      const correspondingEvent = formData.eventDates.find(
        (eventDate) => eventDate.listId === shift.parentListIdForShift
      );

      //  const shiftStart = correspondingEvent.date + 'T' + shift.shiftStart
      //   const shiftEnd = correspondingEvent.date + 'T' + shift.shiftEnd

      const shiftStart = correspondingEvent.date.replace(
        "T00:00",
        "T" + shift.shiftStart
      );
      const shiftEnd = correspondingEvent.date.replace(
        "T00:00",
        "T" + shift.shiftEnd
      );

      console.log("----modified shiftStart and shiftEnd from NewEventForm: ----");
      console.log("shiftStart: ", shiftStart, " | shiftEnd: ", shiftEnd);
      return {
        ...shift,
        shiftStart,
        shiftEnd,
        shiftPositions: parseInt(shift.shiftPositions),
      };
    });

    console.log("------------------");
    console.log("modified shifts for back: ", modifiedShifts);
    console.log("modified eventDatesOnly for back: ", modifiedEventDates);

    const formDataForBack = {
      ...formData,
      eventDates: modifiedEventDates,
      shifts: modifiedShifts,
    };
    console.log("formData from handleSubmitForm: ", formDataForBack);

    try {
      const newEvent = await createNewEvent({ ...formDataForBack }).unwrap();

      // console.log('formData to submit: ', formData);

      console.log("newEvent from createNewEvent fribt: ", newEvent);

      //TC navigate
    } catch (err) {
      console.error("error from createNewEvent: ", err);
      toast.error(err?.data?.message);

    }
  };

  return (
    <Container>
      <Stack gap={3}>
        <Form>
          <h2>Event Form</h2>

          <FloatingLabel
            controlId="eventFormInput"
            label="Event Name"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={formData.eventName}
              onChange={(e) =>
                setFormData({ ...formData, eventName: e.target.value })
              }
              placeholder="Enter event name"
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="eventFormInput"
            label="Event Description"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={formData.eventDescription}
              onChange={(e) =>
                setFormData({ ...formData, eventDescription: e.target.value })
              }
              placeholder="Enter event description"
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="eventFormInput"
            label="Event Venue"
            className="mb-3"
          >
            <Form.Select
              value={formData.eventVenue}
              name="venueFilter"
              onChange={(e) =>
                setFormData({ ...formData, eventVenue: e.target.value })
              }
            >
              <option value={""}> - Select Campus -</option>
              <option value={"Casa Loma"}>Casa Loma</option>
              <option value={"St James"}>St James</option>
              <option value={"Waterfront"}>Waterfront</option>
              <option value={"External"}>External</option>
            </Form.Select>
          </FloatingLabel>

          <br></br>

          <Row>
            <Col>Event Dates</Col>
            <Col xs={1}></Col>

            <Col>ShiftStart Time</Col>
            <Col>ShiftEnd Time</Col>
            <Col>Shift Posituios</Col>
            <Col xs={1}></Col>
          </Row>
          <Row>
            <br></br>
          </Row>

          {renderEventDatesAndShifts}
          <Row>
            <Col>
              <Button
                type="button"
                variant="warning"
                onClick={addEventDateAndShift}
              >
                Add Event And Shift
              </Button>
            </Col>
          </Row>

          <br></br>
          <Button type="button" variant="warning" onClick={handleShowModal}>
            Submit Event
          </Button>

          <ConfirmationEventModal
            handleCloseModal={handleCloseModal}
            handleFormSubmit={handleFormSubmit}
            title={"Create new event?"}
            showModal={showModal}
            confirmButtonText={"Add Event"}
          >
            <p>Confirm to add new event</p>
          </ConfirmationEventModal>

          <Row>
            <br></br>
          </Row>
        </Form>
      </Stack>
    </Container>
  );
};

export default NewEventForm;
