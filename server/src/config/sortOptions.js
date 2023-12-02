// const SORT_OPTIONS = {

//     AZ: 'az',
//     SOONEST: 'soonest',
//     OPEN: 'open'
// }

// const SORT_INDEX ={

//     EVENTNAME: 'eventName',
//     EVENTDATE: 'eventDate',
//     OPENPOSITIONS: 'openPositions'
// }

const SORT_OBJECT = {

    EVENT_AZ : {

        sortOption: 'event_az',
        sortIndex: 'eventName' 
        
    },

    VOLUNTEER_AZ: {
        sortOption: 'volunteer_az',
        sortIndex: 'username'
    },

    SOONEST: {

        sortOption: 'soonest',
        // sortIndex:  'eventDate'
        sortIndex:  'eventDates'
        
    },

    OPENPOSITIONS: {
        sortOption: 'open',
        sortIndex: 'openPositions'
        
    },

    // LATEST: {
    //     sortOption: 'latest',
    //     sortIndex: 'createdAt'
    // },

    // voluns

    HOURS: {
        sortOption: 'hours',
        sortIndex: 'totalVolunteeredHours'
    }
}

module.exports = {
    // SORT_OPTIONS, SORT_INDEX,
    SORT_OBJECT};
