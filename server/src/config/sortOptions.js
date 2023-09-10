const SORT_OPTIONS = {



    AZ: 'az',
    SOONEST: 'soonest',
    OPEN: 'open'
}

const SORT_INDEX ={

    EVENTNAME: 'eventName',
    EVENTDATE: 'eventDate',
    OPENPOSITIONS: 'openPositions'
}

const SORT_OBJECT = {

    AZ : {

        sortOption: 'az',
        sortIndex: 'eventName' 
        
    },

    SOONEST: {

        sortOption: 'soonest',
        sortIndex:  'eventDate'
        
    },

    OPENPOSITIONS: {
        sortOption: 'open',
        sortIndex: 'openPositions'
        
    }
}

module.exports = {
    // SORT_OPTIONS, SORT_INDEX,
    SORT_OBJECT};
