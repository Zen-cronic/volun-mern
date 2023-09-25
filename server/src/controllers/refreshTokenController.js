const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')
require('dotenv').config();

const refresh = (req, res) => {

    const cookies = req.cookies

    
    if(!cookies?.jwt){
        return res.status(401).json({message: "Unauthorized - no cookies"})

    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN,
        async (err, decoded) => {

            if(err){

                return res.status(403).json({message: "Forbidden - invalid token"})

            }

            //the payload for refreshToken from authController
            //userId =/= _id
            const currentUser = await UserModel.findOne({userId: decoded?.userId})

            if(currentUser){

                const accessToken = jwt.sign(
                    {
            
                    UserInfo : {
                        volunId: currentUser._id ,
                        role: currentUser.role
                    
                         }
                    },
            
                    process.env.ACCESS_TOKEN,
                    {
                        expiresIn: '20s'
                    }
                
                )
                res.json({accessToken})
            }
        }

    )
}

module.exports = {refresh};
