import React from "react";
import { Outlet } from "react-router-dom";
import EventFilter from "./filter/EventFilter";
import EventSort from "./sort/EventSort";
import EventSearchBar from "./search/EventSearchBar";
import { Container, Row, Col, Stack, Badge, Button } from "react-bootstrap";
import findingQueryTypes from "../../config/findingQueryTypes";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import useFindingQueryDisplayHook from "../../hooks/useFindingQueryDisplayHook";
import usePublicOrPrivateNavigate from "../../hooks/usePublicOrPrivateNavigate";

const EventHeader = () => {
  const { findingQuery, showFindingQuery, setFindingQuery } =
    useFindingQueryDisplayHook();

  const navigateFn = usePublicOrPrivateNavigate();

  //nu need both showFindingQuery && val.findingQueryType
  const findingQueryDisplay = showFindingQuery ? (
  
    <Stack gap={2} direction="horizontal" className="d-flex flex-wrap">
      <Badge pill bg="warning">
        {capitalizeFirstLetter(findingQuery.findingQueryType)}
      </Badge>{" "}
      results for:
      
        {findingQuery.findingQueryType === findingQueryTypes.FILTER ? (
          Object.entries(findingQuery.findingQueryVal).map(
            ([key, val], index) => (
              <Badge bg="success" key={index}>
                {val === true || String(val) === "true"
                  ? key
                  : `${key}: ${val}`}
              </Badge>
            )
          )
        ) : (
          <Badge bg="success">{findingQuery.findingQueryVal}</Badge>
        )}
      </Stack>
  
  ) : null;

  const handleButtonClick = () => {
    navigateFn("/events");
  };

  const eventHeaderContent = (
    <Container className="my-5">
      <Row>
        <Col xs={6} lg={4}>
          {<EventSearchBar setFindingQuery={setFindingQuery} />}
        </Col>

        <Col xs={6} lg={4}>
          {<EventSort setFindingQuery={setFindingQuery} />}
        </Col>

        <Col xs={6} lg={4}>
          <EventFilter setFindingQuery={setFindingQuery} />
        </Col>
      </Row>

      <Row>
        <br></br>
      </Row>
      <Row>
        <Col>{findingQueryDisplay}</Col>
      </Row>
    </Container>
  );
  return (
    <>
      {eventHeaderContent}

      <Container className="my-2">
        <Button variant="warning" onClick={handleButtonClick}>
          Back to Events List
        </Button>
      </Container>

      <Outlet />
    </>
  );
};

export default EventHeader;
