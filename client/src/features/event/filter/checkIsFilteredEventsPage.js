//how function in production? - don't use baseUrl

const checkIsFilteredEventsPage = (pathname) => {


  //  const devBaseUrl = import.meta.env.BASE_URL;
  // const filteredEventsPageRegex = new RegExp(
  //   `^${devBaseUrl}dash/events/filter$`
  // );
  const filteredEventsPageRegex = new RegExp(
    `^/dash/events/filter$`
  );

  const isFilteredEventsPage = filteredEventsPageRegex.test(pathname);

  if (isFilteredEventsPage) {
    // console.log("at filtered events page");
    return true;
  } else {
    // console.log("NOT at filtered events page");
    return false;
  }
};

export default checkIsFilteredEventsPage;
