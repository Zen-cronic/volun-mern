import React from "react";
import { Badge, Stack } from "react-bootstrap";

const FilterTagsDisplay = ({ filterTags }) => {
  if (!filterTags) {
    return null;
  }

  console.log("filterTags: ", filterTags);

  //dir-vertical className=" col-md-5 mx-auto"
  const content = (
    <td>
      <Stack gap={2} direction="horizontal" className="d-flex flex-wrap">
        {filterTags.map((filterTagObj, filterTagObjIndex) =>
          Object.entries(filterTagObj).map(([key, value], tagIndex ) => (
            
              <Badge pill bg="success" key={tagIndex + filterTagObjIndex}>
                {(value === true || String(value) === 'true')? key : `${key}: ${value}`}
              </Badge>
            
          ))
        )}
      </Stack>
    </td>
    
   
  );

  return content;
};

export default FilterTagsDisplay;
