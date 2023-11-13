import React from "react";
import { useSelector } from "react-redux";
import { selectSortedVolunteers } from "../volunteersSlice";
import SingleVolunteerExcerpt from "../SingleVolunteerExcerpt";
import VolunteersListLayout from "../VolunteersListLayout";

const SortedVolunList = () => {
  const sortedVolunteers = useSelector(selectSortedVolunteers);

  let content;

  if (sortedVolunteers.length) {
    content = sortedVolunteers.map((volun) => {
      const volunId = volun.volunId;
      // const volunId =  volun._id
      return (
        <tr key={volunId}>
          <SingleVolunteerExcerpt key={volunId} volunId={volunId} />
        </tr>
      );
    });
  }
  // } else {
  //   content = <p>No voluns for sort</p>;
  // }
  return (<VolunteersListLayout tableBodyContent={content}/>)
};

export default SortedVolunList;
