import React from "react";

const HighlightSearchResults = ({text, highlight}) => {

  //global & caseInsensitive for the searchTerm

  if(typeof text !== "string"){

    throw new Error("text is not a string");
  }
  
  const textParts = text.split(new RegExp(`(${highlight})`, "gi"));

  // console.log(textParts, '  : textParts');
  
  const withHighlightedContent = (
    <span>
      {textParts.map((textPart, index) => {
        if (textPart.toLowerCase() === highlight.toLowerCase()) {
          return (
            <span key={index} style={{ backgroundColor: "yellow" }}>
              {textPart}
            </span>
          );
        } else {
          return textPart;
        }
      })}
    </span>
  );

  return withHighlightedContent;
};

export default HighlightSearchResults;
