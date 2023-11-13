const { default: mongoose } = require("mongoose");
const calculateShiftDuration = require("../helpers/model-helpers/calculateShiftDuration");
const {
  includedTimeInDate,
  sameDateShift,
  shiftStartIsBefore,
  validateShiftTime,
} = require("../helpers/model-helpers/shiftDateValidators");
const convertLocalDateString = require("../helpers/convertLocalDateString");
const { isEqual } = require("date-fns");
const filterNonDuplicate = require("../helpers/filterNonDuplicate");

const EventShiftSchema = new mongoose.Schema({
  shiftStart: {
    type: Date,
    required: true,
  },

  shiftEnd: {
    type: Date,
    required: true,
  },

  localShiftStart: {
    type: String,
  },

  localShiftEnd: {
    type: String,
  },

  shiftDuration: {
    type: Number,
  },

  shiftPositions: {
    type: Number,
    required: true,

    //    validate: {

    //     validator: function(){

    //         return (this.shiftPositions > 0)
    //     },

    //     message: 'shiftPositions must be greater than 0 upon creation'
    // }
  },

  signedUpVolunteers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

//validate shiftStart and shiftEnd times
EventShiftSchema.pre("validate", function (next) {
  // if(!this.$parent().isNew
  // &&
  //     !this.$parent().isModified('shifts')
  // )   {

  //     console.log('parent doc is NOT new, therefore 1) pre-VALIDATE not called');
  //     return next()

  // }
  // console.log(options.w);
  console.log("1) pre-Validate for shiftStart and shiftEnd called");

  if (!sameDateShift(this.shiftStart, this.shiftEnd)) {
    throw new Error("shift MUST fall on the same date");
  }

  if (
    !(includedTimeInDate(this.shiftStart) && includedTimeInDate(this.shiftEnd))
  ) {
    throw new Error("THH:mm must be included in shiftStart and shiftEnd");
  }

  if (!validateShiftTime(this.shiftStart, this.shiftEnd)) {
    throw new Error("shift times must be full hours :00 or half :30 only");
  }

  //nu need - YES need for same date but "after" time
  if (!shiftStartIsBefore(this.shiftStart, this.shiftEnd)) {
    throw new Error("shift start time must be BEFORE shift end");
  }

  next();
});

//pre for shiftDuration
EventShiftSchema.pre("save", function (next) {
  // if(!this.$parent().isNew
  // &&
  //     !this.$parent().isModified('shifts')
  // ){

  //     console.log('parent doc is NOT new, therefore 2) pre-SAVE not called');
  //     return next()

  // }
  console.log("2) pre-Save for shift DURATION");
  this.shiftDuration = calculateShiftDuration(this.shiftStart, this.shiftEnd);

  if (this.shiftDuration <= 0 || this.shiftDuration > 12) {
    throw new Error(
      "shift duration canNOT be less than or equal to 0 or more than 12 hours"
    );
  }

  next();
});

//create localShiftDates based on shiftStart and shiftEnd
//pre for localStart and localEnd
EventShiftSchema.pre("save", function (next) {
  //if NOT new
  //AND if shifts arr NOT modified
  // if(!this.$parent().isNew
  // &&
  //     !this.$parent().isModified('shifts')
  // ){

  //     console.log('parent doc is NOT new, therefore 3) pre-SAVE not called');
  //     return next()

  // }

  console.log("3) pre localStart and LocalEnd eventSHIFTschema called");

  this.localShiftStart = convertLocalDateString(this.shiftStart);

  this.localShiftEnd = convertLocalDateString(this.shiftEnd);

  next();
});
//[] check if can be 0 on update from EditEventSchema
//pre for shiftPositions
EventShiftSchema.pre("save", function (next) {
  //if NOt isNew - allow 0 to save (signing up)
  // AND
  //if IS modified - allow 0 to save (signing up)

  //condition for signing up: 1) !isNew 2) shifts isModified

  if (!this.$parent().isNew && this.$parent().isModified("shifts")) {
    console.log(
      "parent doc is NOT new, therefore 3.5) not called - shiftPosi > 0"
    );
    return next();
  }

  //if isNew - shiftPosi must > 0
  //if modified - shiftPosi must > 0

  if (this.shiftPositions <= 0) {
    throw new Error(
      "shiftPositions must be greater than 0 upon creation And reSave from signing up"
    );
  }

  console.log("3.5) shiftPositions pre called");
  next();
});

const EventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },

    eventDates: {
      type: [Date],
      required: true,

      //y?
      default: undefined,
    },

    localEventDates: {
      type: [String],
    },

    shifts: {
      type: [EventShiftSchema],
      required: true,
      validate: {
        validator: function () {
          return this.shifts.length;
        },

        message: "shifts Arr canNOT be an empty arr",
      },
    },

    openPositions: {
      type: Number,
    },

    eventVenue: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//either save or validate hook works
//pre-VAlidate for shiftDates + eventDates
EventSchema.pre("validate", function (next) {
  //   if(!this.isNew
  //     &&
  //         !this.isModified('shifts')
  //     ){

  //         console.log('main doc is NOT new, therefore 4) pre-VALIDATE not called');
  //         return next()

  //   }

  console.log("4) pre-VAlidate for shiftDates + eventDates validator");
  this.shifts.map((shift) => {
    if (
      !this.eventDates.some(
        (date) => date.getDate() === shift.shiftStart.getDate()
      )
    ) {
      console.log("--- Error dates: ---");
      console.log("shiftInfo: ", shift._id, " | ", shift.shiftStart);
      throw new Error("shift Dates must be on at least one of the eventDates");
    }
  });

  // const sortedDurations = this.shifts.sort((a,b) => {

  //     return a.shiftDuration - b.shiftDuration
  // })
  // console.log(sortedDurations);

  next();
});

//hook for removing duplicate eventDates obj and localEventDates str from arr
EventSchema.pre("validate", function (next) {
  console.log(
    "9) pre-VALIDATE for removing duplicate eventDates obj and localEventDates str from arr"
  );

  const nonDupLocalEventDates = filterNonDuplicate(
    this.localEventDates.slice()
  );
  this.localEventDates = nonDupLocalEventDates;

  const bufferEventDates = this.eventDates.slice();
  const nonDupEventDates = [];

  bufferEventDates.map((bufferDate) => {
    const duplicateDate = nonDupEventDates.find((date) =>
      isEqual(date, bufferDate)
    );

    if (!duplicateDate) {
      nonDupEventDates.push(bufferDate);
    }
  });

  this.eventDates = nonDupEventDates;

  next();
});
//create localEventDates based on eventDates[] and check conversion using getDate()

EventSchema.pre("save", function (next) {
  // if(!this.isNew
  //     &&
  //     !this.isModified('shifts')
  //     ){

  //     console.log('main doc is NOT new, therefore 5) pre-SAVE not called');
  //     return next()

  // }

  console.log("5) eventtSchema localDates  called");

  this.localEventDates = this.eventDates.map((utcDate) =>
    convertLocalDateString(utcDate)
  );

  for (let i = 0; i < this.eventDates.length; i++) {
    // console.log("localEvent Str => Date: ",new Date(this.localEventDates[i]));
    // console.log(new Date(this.localEventDates[i]).getDate() );
    // console.log((this.eventDates[i]).getDate());

    if (
      new Date(this.localEventDates[i]).getDate() !==
      this.eventDates[i].getDate()
    ) {
      throw new Error("localEventDate and eventDate must have the same date");
    }
  }
  next();
});

//pre-save hook for openPositions based on shiftPosi
EventSchema.pre("save", function (next) {
  console.log("FROM 6) this.isModified('shifts')", this.isModified("shifts"));
  console.log(
    "6) pre-save hook for openPositions based on shiftPosi | called w each update in shiftPosi"
  );

  //if(this.isNew() && this isModified())
  const shiftPositionsObj = this.shifts.reduce((prev, current) => {
    const accumulated = prev.shiftPositions + current.shiftPositions;

    // console.log('totalPositions progression: ', accumulated);
    return { shiftPositions: accumulated };
  });

  this.openPositions = shiftPositionsObj.shiftPositions;

  console.log("total open posiontsn 6)", this.openPositions);
  next();
});

//pre-save hook for duplicate shift time
EventSchema.pre("save", function (next) {
  // if(!this.isNew
  //     &&
  //     !this.isModified('shifts')
  //     ){

  //     console.log('main doc is NOT new NOR shifts isNOT modified, therefore 7) pre-SAVE not called');
  //     return next()

  // }
  console.log("7)pre-SAVE for duplicate shift time but from EventSchema");

  const bufferShiftsArr = this.shifts.slice();
  const sortedShiftsDurations = bufferShiftsArr.sort((a, b) => {
    return a.shiftDuration - b.shiftDuration;
  });

  for (let i = 0; i < sortedShiftsDurations.length - 1; i++) {
    const currentShift = sortedShiftsDurations[i];
    const shiftOnRight = sortedShiftsDurations[i + 1];
    if (
      isEqual(currentShift.shiftStart, shiftOnRight.shiftStart) &&
      isEqual(currentShift.shiftEnd, shiftOnRight.shiftEnd)
    ) {
      throw new Error("shift times and durations canNOT be the same 7)");
    }
  }

  next();
});

// EventSchema.pre('updateOne',{document:false, query: true}, async function(next){

//     console.log('8-B) EventSchema pre-updateOne hook called as QueryMiddleware');

//             //getUpdate returns current update opeartions
//             //the $set obj with updatedAt field
//     const modifiedField = this.getUpdate().$set

//     console.log('8-B) modifiedField: ', modifiedField);

//     this.updateOne()
//     const docToUpate = await this.model.findOne(this.getQuery())

//     console.log('8-B) docToUpate: ', docToUpate);

//     // const updateInfo = await this.model.findOne(this.getUpdate())
//     // console.log('8-B) updateInfo: ', updateInfo);
//     next()

// })

module.exports = mongoose.model("events", EventSchema);
