import React from "react";
import { Badge, Stack } from "react-bootstrap";

const FilterTagsDisplay = ({ filterTags }) => {
  if (!filterTags) {
    return null;
  }

  console.log("filterTags: ", filterTags);

  //dir-vertical className=" col-md-5 mx-auto"
  const content = (
    <Stack gap={2}  direction="horizontal" className="mx-auto w-75 ">
      {filterTags.map((tag, index) => (
        <Badge pill bg="success">
          {tag}
        </Badge>
      ))}
    </Stack>
  );

  return (
    <td>
      {content}
    </td>
  );
};

export default FilterTagsDisplay;
