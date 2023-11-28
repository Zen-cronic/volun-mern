const asyncHandler = require("express-async-handler");
const requiredInputChecker = require("../helpers/requiredInputChecker");
const bcrypt = require("bcrypt");
const Event = require("../models/Event");
const User = require("../models/User");
const toLowerNoSpace = require("../helpers/toLowerNoSpace");
const { ROLES } = require("../config/roles");
const sortOrder = require("../helpers/sortOrder");
const {
  isAfter,
  isBefore,
  differenceInHours,
  differenceInCalendarDays,
} = require("date-fns");
const { SORT_OBJECT } = require("../config/sortOptions");

const removeElemObjIdArray = require("../helpers/removeElemObjIdArray");
const sortVolunteersHelper = require("../helpers/sortVolunteersHelper");
const elemObjPropValIncludes = require("../helpers/elemObjPropValIncludes");

const createNewVolunteer = asyncHandler(async (req, res) => {
  const { username, userId, password, role } = req.body;

  if (requiredInputChecker(req.body)) {
    return res.status(400).json({ message: "All fields required" });
  }

  //more validators --

  //NOT findById
  const duplicate = await User.findOne({ userId }).lean().exec();

  if (duplicate) {
    return res.status(400).json({ message: "Alreday registered" });
  }

  // const hashedPwd = await bcrypt.hash(password, 10)

  // const newVolunteer = new User({username, userId, password: hashedPwd, role})
  const newVolunteer = new User({ username, userId, password, role });

  await newVolunteer.save();

  //data.newVolunteer in front from queryFulfilled or unwrap()

  // return res.send({user>})
  //omit password
  res.json({ newVolunteer });
});

//only admin can getAllVolunteers - exclude role: ADMIN
const getAllVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await User.find({ role: { $eq: ROLES.VOLUNTEER } })
    .lean()
    .select(["-password", "-__v"])
    .exec();

  if (!volunteers?.length) {
    return res.status(400).json({ message: "No volunteers exist" });
  }

  //an arry of volunteers obj || {volunteers}
  //self-convention: {volunteers} so that front: responseDate.volunteers thru transformResponse
  res.json({ volunteers });
});

//get one user - both volun or admin
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(400)
      .json({ message: "db id needed in params for accesing a single user" });
  }

  const existingUser = await User.findById(id)
    .lean()
    .select({ password: 0, __v: 0 })
    .exec();

  if (!existingUser) {
    res.status(400).json({ message: "User DNE for get" });
  }

  res.json({ existingUser });
});

//update volunteer e.g. username, and password with PUT
const updateVolunteer = asyncHandler(async (req, res) => {
  //volunId = db id
  //userId = sch id
  const { username, newPassword, volunId, currentPassword } = req.body;

  // console.log('required fields updateVolunteer: ', {...req.body});

  //password change, username/info change is optional
  if (!volunId) {
    return res.status(400).json({ message: "db volunId field required" });
  }

  // const existingUser = await User.findOne({userId}).exec()
  const existingUser = await User.findById(volunId).exec();

  if (!existingUser) {
    return res.status(400).json({ message: "User DNE for PUT update" });
  }

  //change name for valid user
  const duplicateUserName = await User.findOne({ username }).lean().exec();

  if (
    duplicateUserName &&
    duplicateUserName?._id.toString() !==
      //  existingUser._id

      //using _id from req.body
      volunId
  ) {
    return res
      .status(400)
      .json({ message: "Username already exists for change" });
  }

  if (newPassword && currentPassword) {
    const isValidPwd = await existingUser.matchPassword(currentPassword);

    if (!isValidPwd) {
      return res
        .status(400)
        .json({ message: "Please type in the current password correctly" });
    }

    existingUser.password = newPassword;
  }

  existingUser.username = username || existingUser.username;

  const updatedVolunteer = await existingUser.save();

  res.json({ updatedVolunteer, message: "volun info updated" });
});

//model changes  - updateSignedUpShifts
const updateSignedUpShifts = asyncHandler(async (req, res) => {
  const { volunId, eventId, shiftId } = req.body;

  console.log("required fields updateSIgnedUPSHifts: ", { ...req.body });

  if (requiredInputChecker(req.body)) {
    return res.status(400).json({ message: "All fields required" });
  }
  const existingUser = await User.findById(volunId).select("-password").exec();
  const existingEvent = await Event.findById(eventId).exec();

  const existingShift = existingEvent.shifts.find(
    (shift) => shift._id.toString() === shiftId
  );

  const currentDate = new Date(Date.now());

  if (isAfter(currentDate, existingShift.shiftStart)) {
    return res
      .status(400)
      .json({
        message: "sign Up disabled for shift as it's past the sign up date",
      });
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User DNE for PATCH update" });
  }
  if (!existingEvent) {
    return res.status(400).json({ message: "Event DNE for PATCH update" });
  }

  if (!existingShift) {
    return res
      .status(400)
      .json({ message: "SHIFT in event DNE for PATCH update" });
  }

  if (existingUser.signedUpShifts.includes(existingShift._id)) {
    return res
      .status(400)
      .json({
        message: "ALready signed up for event SHIFT - go explore more opport!",
      });
  }

  if (
    // !existingEvent.openPositions
    !existingShift.shiftPositions
  ) {
    if (!existingEvent.openPositions) {
      return res
        .status(400)
        .json({ message: "all event positons filled up! " });
    }

    return res
      .status(400)
      .json({ message: "All shift positons filled up! Try other shifts" });
  }

  existingUser.signedUpShifts.push(shiftId);

  existingShift.shiftPositions -= 1;

  // existingEvent.signedUpVolunteers.push({volunId: volunId, shiftId})

  existingShift.signedUpVolunteers.push(volunId);

  const updatedEvent = await existingEvent.save();
  const updatedUser = await existingUser.save();

  res.json({ updatedEvent, updatedUser });
});

const cancelSignedUpShifts = asyncHandler(async (req, res) => {
  const { volunId, eventId, shiftId } = req.body;

  if (requiredInputChecker(req.body)) {
    return res.status(400).json({ message: "All fields required" });
  }
  const existingUser = await User.findById(volunId)
    .select({ password: 0 })
    .exec();
  const existingEvent = await Event.findById(eventId).exec();

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User DNE for cancel PATCH update" });
  }
  if (!existingEvent) {
    return res
      .status(400)
      .json({ message: "Event DNE for cancel PATCH update" });
  }

  const existingShift = existingEvent.shifts.find(
    (shift) => shift._id.toString() === shiftId
  );

  if (!existingShift) {
    return res
      .status(400)
      .json({ message: "SHIFT in event DNE for cancel PATCH update" });
  }

  if (!existingUser.signedUpShifts.includes(existingShift._id)) {
    return res
      .status(400)
      .json({ message: "Cannot canel event - you haven't signed up for this" });
  }

  const nowDate = new Date(Date.now());

  const shiftStartDate = existingShift.shiftStart;

  if (!isBefore(nowDate, shiftStartDate)) {
    return res
      .status(400)
      .json({ message: "cancel option disabled - already past event" });
  }

  const differenceHours = Math.abs(differenceInHours(shiftStartDate, nowDate));
  console.log(differenceHours);

  if (differenceHours <= 1) {
    return res
      .status(400)
      .json({
        message: "Canel option disbled cuz less than 1 hour till event",
      });
  }

  const newSignedUpVolunteers = removeElemObjIdArray(
    existingShift.signedUpVolunteers,
    volunId
  );
  existingShift.signedUpVolunteers = newSignedUpVolunteers;
  existingShift.shiftPositions += 1;

  await existingEvent.save();

  const newSignedUpShifts = removeElemObjIdArray(
    existingUser.signedUpShifts,
    shiftId
  );
  existingUser.signedUpShifts = newSignedUpShifts;

  await existingUser.save();

  // console.log(nowDate, shiftStartDate);

  res.json({
    // nowDate, shiftStartDate,
    eventName: existingEvent.eventName,
    username: existingUser.username,
    shiftDuration: existingShift.shiftDuration,
    shiftId: existingShift._id,

    // differenceInHours: differenceHours,
  });
});

//chking update and cancel signedUpShifts

const checkUpdatableAndCancelableShifts = [
  asyncHandler(async (req, res, next) => {
    const { volunId, eventId, shiftId, buttonType } = req.body;

    if (requiredInputChecker(req.body)) {
      return res
        .status(400)
        .json({ message: "All fields required checkUpdateAndCancelShifts" });
    }

    const existingUser = await User.findById(volunId)
      .select("-password")
      .exec();
    const existingEvent = await Event.findById(eventId).exec();
    //? needed for when existingEvent DNE
    const existingShift = existingEvent?.shifts.find(
      (shift) => shift._id.toString() === shiftId
    );

    //some
    if ([existingUser, existingEvent, existingShift].some((elem) => !elem)) {
      return res
        .status(400)
        .json({ message: "User|Event|Shift DNE for PATCH update|cancel" });
    }

    //every
    // if(![existingUser, existingEvent, existingShift].every(elem => elem)){

    //     return res.status(400).json({message: "User|Event|Shift DNE for PATCH update"})
    // }

    const currentDate = new Date(Date.now());

    if (isAfter(currentDate, existingShift?.shiftStart)) {
      return res.json({
        disable: true,
        message:
          "sign Up / cancel disabled for shift as it's past the sign up date",
      });
    }

    if (buttonType === "cancel") {
      res.locals.existingUser = existingUser;
      res.locals.existingEvent = existingEvent;
      res.locals.existingShift = existingShift;

      return next();
    }

    if (existingUser.signedUpShifts.includes(existingShift._id)) {
      return res.json({
        disable: true,
        message: "ALready signed up for event SHIFT - go explore more opport!",
      });
    }

    if (!existingShift.shiftPositions) {
      return res.json({
        disable: true,
        message: "All shift positons filled up! Try other shifts",
      });
    }

    return res.json({ disable: false, message: "Can sign up for shift" });
  }),

  asyncHandler(async (req, res) => {
    const { existingEvent, existingUser, existingShift } = res.locals;

    if (!existingUser.signedUpShifts.includes(existingShift._id)) {
      // return res.status(400).json({message: "Cannot canel event - you haven't signed up for this"})
      return res.json({
        message: "Cannot canel event - you haven't signed up for this",
        disable: true,
      });
    }

    const nowDate = new Date(Date.now());
    const shiftStartDate = existingShift.shiftStart;
    const differenceHours = Math.abs(
      differenceInHours(shiftStartDate, nowDate)
    );
    console.log(differenceHours);

    if (differenceHours <= 1) {
      return res.json({
        message: "Canel option disbled cuz less than 1 hour till event",
        disable: true,
      });
    }

    return res.json({ disable: false, message: "Can cancel shift" });
  }),
];

const searchVolunteers = asyncHandler(async (req, res) => {
  // /search/?q=:query
  const { q } = req.query;

  //this only returns exact matches
  // const allEvents = await Event.find({eventName: {$in: q}})

  const allVolunteers = await User.find({ role: "VOLUNTEER" })
    .lean()
    .select("-password")
    .exec();

  const matchingVolunteers = allVolunteers
    .filter((volun) =>
      //lowercase AND remove space for both search term and the searched

      toLowerNoSpace(volun.username).includes(toLowerNoSpace(q))
    )
    .map((volun) => ({ volunId: volun._id, volunName: volun.username }));

  res.json({ searchTerm: q, matchingVolunteers });
});

//update volunteereedShifts + calculate volunteered hours
// const updateVolunteeredShifts = asyncHandler(async(req,res)=>{

//     const nowDate = new Date(Date.now())

//     const allEventsWithShifts = await Event.find().select(["_id", "shifts"]).exec()
//         .then(events =>
//                 events.map(event => (

//                      {
//                         eventId: event._id,
//                         eventShifts: event.shifts.map(shift => shift._id)
//                      }

//                 )
//     ))

//     const allVolunteers = await User.find().select({_id: 1, volunteeredShifts: 1, signedUpShifts: 1}).select({password: 0}).exec()

//     // const toRemove = allVolunteers.findIndex()
//     // allVolunteers.splice(toRemove, 1)

//     for(let i = 0; i< allVolunteers.length; i++){

//         const currentVolun = allVolunteers[i]
//         const signedUpShifts = currentVolun.signedUpShifts

//         for(let j = 0; j<signedUpShifts.length; j++){

//             const currentSignedUpShift = signedUpShifts[j]

//             for(let k = 0; k<allEventsWithShifts.length; k++){

//                 const currentEvent = allEventsWithShifts[k]
//                 const currentEventId = currentEvent.eventId

//                 const includedShiftId = currentEvent.eventShifts.find(shift => shift.toString() === currentSignedUpShift.toString())

//                 if(currentVolun.volunteeredShifts.includes(includedShiftId)){

//                     //or break?
//                     continue
//                 }

//                 if(includedShiftId){
//                     console.log(includedShiftId, " included in event ", currentEventId);

//                     const event = await Event.findById(currentEventId)
//                     const shiftInfo = event.shifts.find(shift => shift._id.toString() === currentSignedUpShift.toString())

//                     // console.log("End time of shift: ", shiftInfo.shiftEnd,  nowDate)
//                     // console.log( "  local end: ", shiftInfo.localShiftEnd);

//                     if(isBefore(shiftInfo.shiftEnd, nowDate)){

//                         console.log('successfully volunteered in shift - add to volunteeredEvent');

//                         currentVolun.volunteeredShifts.push(includedShiftId)

//                         await currentVolun.save()
//                     }
//                     else{

//                         // console.log('only signed up, NOT yet completed ', shiftInfo.shiftEnd, nowDate);
//                         currentVolun.volunteeredShifts.splice(currentVolun.volunteeredShifts.indexOf(includedShiftId),1)
//                     }

//                 }

//             }
//         }
//     }

//     const extractedPropVolunteers = allVolunteers.map(volun => (objPropExtractor([ 'volunteeredShifts', '_id'], volun.toObject())))

//     // const mongooseExtractedVolunteers = await User.find().select({_id: 1, volunteeredShifts: 1, __v: 1}).select({password: 0}).exec()

//     // extractedPropVolunteers.map(e => console.log(e._id))
//     // allVolunteers.map(e => console.table(Object.entries(e.toObject())))

//     res.json({allEventsWithShifts, extractedPropVolunteers, allVolunteers})
// })

//updateVolunteeredShifts aft model change
const updateVolunteeredShifts = asyncHandler(async (req, res) => {
  const nowDate = new Date(Date.now());

  const allEventsWithShifts = await Event.find()
    .select({ shifts: 1 })
    .exec()
    .then((events) =>
      events.map((event) => ({
        eventId: event._id,
        eventShifts: event.shifts.map((shift) => shift._id),
      }))
    );

  const allVolunteers = await User.find().select({ password: 0 }).exec();

  await Promise.all(
    allVolunteers.map(async (volun) => {
      // allVolunteers.map(async (volun)=> {

      await Promise.all(
        volun.signedUpShifts.map(async (signedUpShift) => {
          // let includedInEvent = {}
          const includedEvent = allEventsWithShifts.find((event) => {
            const shiftId = event.eventShifts.find(
              (shift) => shift.toString() === signedUpShift.toString()
            );

            // includedInEvent = event
            return shiftId;
          });

          // if(includedShiftId){
          if (includedEvent) {
            console.log(
              signedUpShift,
              " shift included in ",
              includedEvent.eventId
            );
          }
          // else{
          //     console.log(includedShiftId, " NOT included");
          // }

          const alreadyAddedShift = volun.volunteeredShifts.find(
            (shift) =>
              shift.shiftId?.toString() === signedUpShift._id.toString()
          );
          //skip adding this

          if (!alreadyAddedShift) {
            const event = await Event.findById(includedEvent?.eventId);
            const signedUpShiftInfo = event?.shifts.find(
              (shift) => shift._id.toString() === signedUpShift.toString()
            );

            if (isBefore(signedUpShiftInfo?.shiftEnd, nowDate)) {
              volun.volunteeredShifts.push({
                shiftId: signedUpShift._id,
                shiftDuration: signedUpShiftInfo.shiftDuration,
              });
            }
          }

          //ParallelSaveError ()
          // await volun.save()
        })
      );

      // const totalHoursObj = volun.volunteeredShifts.reduce((prev, current)=> {
      //     const accumulatedHours = prev.shiftDuration + current.shiftDuration
      //     return {shiftDuration: accumulatedHours}
      // }, {shiftDuration: 0})

      // console.log(totalHoursObj.shiftDuration, " for ", volun.username);
      // volun.totalVolunteeredHours = totalHoursObj.shiftDuration
      await volun.save();
    })
  );

  const volunWithTotalHours = await Promise.all(
    allVolunteers.map(async (volun) => {
      const totalHoursObj = volun.volunteeredShifts.reduce(
        (prev, current) => {
          const accumulatedHours = prev.shiftDuration + current.shiftDuration;

          return { shiftDuration: accumulatedHours };
        },
        { shiftDuration: 0 }
      );

      console.log(totalHoursObj.shiftDuration, " for ", volun.username);

      volun.totalVolunteeredHours = totalHoursObj.shiftDuration;

      await volun.save();

      return {
        volunId: volun._id,
        totalVolunteeredHours: volun.totalVolunteeredHours,
      };
    })
  );

  res.json({
    allEventsWithShifts,
    // extractedPropVolunteers
    // allVolunteers,
    // volunWithTotalHours
  });
});

const getUpcomingSignedUpShifts = asyncHandler(async (req, res) => {
  const { volunId } = req.params;

  if (!volunId) {
    res
      .status(400)
      .json({ message: "db id needed in params for accesing a single  VOLUN" });
  }

  const existingVolun = await User.findById(volunId)
    .lean()
    .select({ password: 0, __v: 0 })
    .exec();

  if (!existingVolun) {
    res.status(400).json({ message: "Volunteer DNE for getupcomingsignedUpshifts" });
  }

  const currentDate = new Date(Date.now());

  const allEventsWithShifts = await Event.find()
    .select({ shifts: 1 })
    .exec()
    .then((events) =>
      events.map((event) => ({
        eventId: event._id,
        eventShifts: event.shifts.map((shift) => shift._id),
      }))
    );

  const signedUpShifts = existingVolun.signedUpShifts;

  const upcomingShifts = [];

  await Promise.all(
    signedUpShifts.map(async (signedUpShift) => {
      // {eventId: , eventShifts: , | undefined}
      const includedEvent = allEventsWithShifts.find((event) => {
        const foundEvent = event.eventShifts.find(
          (shiftId) => shiftId.toString() === signedUpShift.toString()
        );

        return foundEvent;
      });

      const event = await Event.findById(includedEvent?.eventId);

      const signedUpShiftInfo = event?.shifts.find(
        (shift) => shift._id.toString() === signedUpShift.toString()
      );

      if (isAfter(signedUpShiftInfo?.shiftStart, currentDate)) {
        //  or  if(isBefore(signedUpShiftInfo.shiftEnd, nowDate)){

        const isPropValIncludedInArr = elemObjPropValIncludes(
          upcomingShifts,
          "eventId",
          includedEvent.eventId
        );

        if (isPropValIncludedInArr === -1) {
          upcomingShifts.push({
            eventId: includedEvent.eventId,
            signedUpShifts: [signedUpShiftInfo],
          });
        } else {
          upcomingShifts[isPropValIncludedInArr].signedUpShifts.push(
            signedUpShiftInfo
          );
        }
      }
    })
  );

  res.json({ upcomingShifts });
});

const sortVolunteers = asyncHandler(async (req, res) => {
  const [[sortOption, orderBool]] = Object.entries(req.body);

  if (typeof orderBool !== "boolean") {
    throw new Error(
      "Sort val must be a boolean for either ascending or descending - voluns"
    );
  }

  const sortedVolunteers = await sortVolunteersHelper(sortOption, orderBool)
    //serilaized volunters
    .then((volunteers) =>
      volunteers.map((volun) => ({
        volunId: volun._id,
        volunHours: volun.totalVolunteeredHours,
        volunName: volun.username,
      }))
    );

  res.json({ sortedVolunteers });
});

module.exports = {
  createNewVolunteer,
  getAllVolunteers,
  updateVolunteer,

  updateSignedUpShifts,
  cancelSignedUpShifts,

  searchVolunteers,

  // sortVolunteersAlphabetically,
  // // sortVolunteersByEventsCount,

  // sortVolunteersByHours,
  // refreshSignedUpEvents,

  updateVolunteeredShifts,

  getUserById,

  // sortVolunteers  //arr of asyncHanlders
  sortVolunteers,

  getUpcomingSignedUpShifts,

  checkUpdatableAndCancelableShifts
};
