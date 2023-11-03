import React, { useEffect, useState } from "react";
// import EventFilter from './filter/EventFilter'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import EventFilter from "./filter/EventFilter";
import EventSort from "./sort/EventSort";
import EventSearchBar from "./search/EventSearchBar";
import { Container, Row, Col, Stack, Badge, Button } from "react-bootstrap";
import findingQueryTypes from "../../config/findingQueryTypes";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import LinkContainer from "react-router-bootstrap/LinkContainer";

const EventHeader = () => {
  const [val, setVal] = useState({
    findingQueryType: "",
    findingQueryVal: "",
  });

  const location = useLocation();
  const [showFindingQuery, setShowFindingQuery] = useState(false);

  // const [showFindingQuery, setShowFindingQuery] = useState(Object.values(findingQueryTypes).some(queryType =>  ( window.location.pathname.includes(`/${queryType}`)))
  // )

  useEffect(() => {
    const displayQuery = Object.values(findingQueryTypes).some((queryType) =>
      location.pathname.includes(`/${queryType}`)
    );

    // if(!showFindingQuery){
    //   setVal( {findingQueryType: "",
    //   findingQueryVal: "",})

    // }

    setShowFindingQuery(displayQuery);
  }, [location]);

  //nu need both showFindingQuery && val.findingQueryType
  const findingQueryDisplay = showFindingQuery && (
    <>
      {capitalizeFirstLetter(val.findingQueryType)} results for:
      <Stack gap={2} direction="horizontal" className="d-flex flex-wrap">
        {val.findingQueryType === findingQueryTypes.FILTER ? (
          Object.entries(val.findingQueryVal).map(([key, val], index) => (
            <Badge bg="success" key={index}>
              {val === true || String(val) === "true" ? key : `${key}: ${val}`}
            </Badge>
          ))
        ) : (
          <Badge bg="success">{val.findingQueryVal}</Badge>
        )}
      </Stack>
    </>
  );

  const eventHeaderContent = (
    <Container className="my-2">
      <Row>
        <Col xs={6} lg={4}>
          {<EventSearchBar val={val} setVal={setVal} />}
        </Col>

        <Col xs={6} lg={4}>
          {<EventSort setVal={setVal} />}
        </Col>

        <Col xs={6} lg={4}>
          <EventFilter setVal={setVal} />
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
      {/* <Link ></Link> */}
    </Container>
      

      <Outlet />
    </>
  );
};

export default EventHeader;
