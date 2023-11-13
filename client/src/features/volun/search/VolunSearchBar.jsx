import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLazyPostSearchedVolunteersQuery } from "../volunteersApiSlice";
import { Form, Button } from "react-bootstrap";
import findingQueryTypes from "../../../config/findingQueryTypes";

const VolunSearchBar = ({ setFindingQuery }) => {
  const [searchParam, setSearchParam] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParam ? searchParam.get("q") : ""
  );

  // const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate();

  const [searchVolunteers] = useLazyPostSearchedVolunteersQuery();
  const handleVolunSearchClick = async (e) => {
    e.preventDefault();

    if (!searchTerm) {
      setSearchTerm("");
      return;
    }

    const encodedSearchTerm = encodeURI(searchTerm);

    try {
      const data = await searchVolunteers(encodedSearchTerm, true).unwrap();

      console.log("unwrapped data from postSearchVolunQuery: ", data);

      // navigate(`/dash/volunteers/search?q=${encodedSearchTerm}` )

      // navigate(`/dash/volunteers/search` )

      setSearchParam((param) => {
        param.set("q", encodedSearchTerm);
        return param;
      });

      navigate(`/dash/volunteers/search?${searchParam}`);

      setFindingQuery({
        findingQueryType: findingQueryTypes.SEARCH,
        findingQueryVal: searchTerm,
      });
      
    } catch (error) {
      console.error("searchVolun front error: ", error);
    }
  };
  return (
    <Form onSubmit={handleVolunSearchClick}>
      <Form.Control
        type="text"
        value={searchTerm ?? ""}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="type volun name..."
      />
      <Button type="submit">Search</Button>
    </Form>
  );
};

export default VolunSearchBar;
