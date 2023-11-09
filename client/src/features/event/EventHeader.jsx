import React from "react";
import { Outlet } from "react-router-dom";
import EventFilter from "./filter/EventFilter";
import EventSort from "./sort/EventSort";
import EventSearchBar from "./search/EventSearchBar";
import { Container, Row, Col, Stack, Badge, Button } from "react-bootstrap";
import findingQueryTypes from "../../config/findingQueryTypes";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import { LinkContainer } from "react-router-bootstrap";
import useFindingQueryDisplayHook from "../../hooks/useFindingQueryDisplayHook";

const EventHeader = () => {
  
  const { findingQuery, showFindingQuery, setFindingQuery } =
    useFindingQueryDisplayHook();

  //nu need both showFindingQuery && val.findingQueryType
  const findingQueryDisplay = showFindingQuery ? (
    <>
      {capitalizeFirstLetter(findingQuery.findingQueryType)} results for:

      <Stack gap={2} direction="horizontal" className="d-flex flex-wrap">

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
    </>
  ) : null;

  const eventHeaderContent = (
    <Container className="my-2">
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
        <Col>{findingQueryDisplay}</Col>
      </Row>
    </Container>
  );
  return (
    <>
      {eventHeaderContent}

      <Container className="my-2">
        <LinkContainer to={"/dash/events"}>
          <Button variant="primary">Back to Events List</Button>
        </LinkContainer>
      </Container>

      <Outlet />
    </>
  );
};

export default EventHeader;
