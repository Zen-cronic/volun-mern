//how function in production? - don't use baseUrl

const checkIsFilteredEventsPage = (pathname) => {

  const filteredEventsPageRegex = [new RegExp(`^/dash/events/filter$`) , new RegExp(`^/events/filter$`)]

  const isFilteredEventsPage = filteredEventsPageRegex.some(regex => regex.test(pathname)) 

  if (isFilteredEventsPage) {
    // console.log("at filtered events page");
    return true;
  } else {
    // console.log("NOT at filtered events page");
    return false;
  }
};

export default checkIsFilteredEventsPage;
