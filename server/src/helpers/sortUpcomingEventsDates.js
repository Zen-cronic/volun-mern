const { closestTo, isAfter, isEqual } = require("date-fns");

const sortUpcomingEventsDates = (eventsArr) => {
  if (!Array.isArray(eventsArr)) {
    throw new Error("Must be an array - sortUpcomingEventsDates");
  }

  if (eventsArr.some((event) => !(event instanceof Object))) {
    throw new Error("Must be an array of objects - sortUpcomingEventsDates");
  }

  const sortUpcomingEventsDatesFx = (event, datesArr, invalidArr = []) => {
    const currentDate = new Date(Date.now());

    // const cmpDatesArray = datesArr.filter(date => invalidArr.includes(date)? false : true)
    const cmpDatesArray = datesArr.filter((date) =>
      invalidArr.some((invalidDate) => isEqual(invalidDate, date))
        ? false
        : true
    );

    console.log("cmpDatesArray: ", cmpDatesArray);

    const closestToCurrentDate = closestTo(currentDate, cmpDatesArray);
    console.log("clossestToCurrentDate: ", closestToCurrentDate);

    //ether condi alone works
    if (closestToCurrentDate === undefined || !cmpDatesArray?.length) {
      return [];
    }

    if (isAfter(closestToCurrentDate, currentDate)) {
      console.log(closestToCurrentDate, " is after ", currentDate);
   
      return [
        {
          eventDate: closestToCurrentDate,
          eventName: event?.eventName,
          eventId: event?._id,
        },
      ];
    }

    // console.log('reched HERE - b4 next fx call');

    invalidArr.push(closestToCurrentDate);

    return sortUpcomingEventsDatesFx(event, datesArr, invalidArr);

    // console.log('reched HERE - after fx called');
  };


  const sortedUpcomingEventsDates = eventsArr.flatMap((event) => {
    const result = sortUpcomingEventsDatesFx(event, event.eventDates);

    console.log("result: ", result);

    return result;
  });

  return sortedUpcomingEventsDates;
};

module.exports = sortUpcomingEventsDates;
