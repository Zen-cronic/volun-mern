const mongoose = require('mongoose')
const { ROLES } = require('../config/roles')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        
        
    },

    userId: {
     
        type: Number,
        required: true,
        unique: true,
        // validate string number here- 9 count
    },
   
    role:{
        type: String,
        default: ROLES.VOLUNTEER
    },


    signedUpShifts: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'events'
        
    }],

    

    // volunteeredShifts: [{

    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'events'
    // }],
    volunteeredShifts: [{
        
        shiftId: {
 
         type: mongoose.Schema.Types.ObjectId,
         ref: 'events'
     },
 
         shiftDuration: {
             type:Number
         },

         _id: false
        }

        
 ],

    totalVolunteeredHours: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
}
)



userSchema.methods.matchPassword = async function( inputPwd){

//    const hashedInputPwd =await bcrypt.hash(inputPwd, 10)
//    console.log("hashedInputPwd: ", hashedInputPwd);
    const isValidPwd = await bcrypt.compare( inputPwd, this.password )

    return isValidPwd
}



userSchema.pre('save', async function(next){

    console.log('pre-SAVE for password encryption');
    if(!this.isModified('password')){
       return next()
        // next()
    }

    
    const salt =await bcrypt.genSalt(10)
    const hashedPwd =await bcrypt.hash(this.password, salt)
    this.password = hashedPwd

    console.log("hashedPwd: ", hashedPwd);
    console.log('after NEXT from passwprod endcryoption preSAVE');
})


//pre hook for signedUp and volunEvents
// userSchema.pre('save', async function(next){


// })

module.exports = mongoose.model('users', userSchema)

