import React from "react";
import { Outlet} from "react-router-dom";
import VolunSearchBar from "./search/VolunSearchBar";
import VolunSort from "./sort/VolunSort";
import useAuth from "../../hooks/useAuth";
import PatchVolunteeredShiftsButton from "./PatchVolunteeredShiftsButton";
import { Container, Row, Col, Badge, Stack, Button } from "react-bootstrap";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";
import { LinkContainer } from "react-router-bootstrap";
import useFindingQueryDisplayHook from "../../hooks/useFindingQueryDisplayHook";

const VolunteerHeader = () => {
  const { isAdmin, role } = useAuth();


  const {findingQuery, showFindingQuery, setFindingQuery} = useFindingQueryDisplayHook()

  const findingQueryDisplay = showFindingQuery ? (
    <Stack gap={2} direction="horizontal" className="d-flex flex-wrap">
      <Badge pill bg="info">
        {capitalizeFirstLetter(findingQuery.findingQueryType)}
      </Badge>
      results for:
      <Badge pill bg="success">
        {findingQuery.findingQueryVal}
      </Badge>
    </Stack>
  ) : null;

  const adminHeaderContent = (
    <Container className="my-2">
      <Row>
        <Col xs={6} lg={3}>
          <VolunSearchBar setFindingQuery={setFindingQuery} />
        </Col>

        <Col xs={6} lg={3}>
          <VolunSort setFindingQuery={setFindingQuery} />
        </Col>
      </Row>

      <Row>
        <Col>{findingQueryDisplay}</Col>
      </Row>
    </Container>
  );
  return (
    <>
      {isAdmin && role === "ADMIN" && adminHeaderContent}
      <Container className="my-2">
        <Row className="my-2">
          <Col>
            <LinkContainer to={"/dash/volunteers"}>
              <Button variant="primary">Back to Volunteers List</Button>
            </LinkContainer>
          </Col>
        </Row>

        <Row className="my-2">
          <Col>
            <PatchVolunteeredShiftsButton />
          </Col>
        </Row>
      </Container>

      <Outlet />
    </>
  );
};

export default VolunteerHeader;
