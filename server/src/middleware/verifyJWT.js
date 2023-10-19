
//verifty accessToken 
const jwt = require('jsonwebtoken');
require('dotenv').config()




const verifyJWT = (req, res, next) => {
 
    const authHeaders = req.headers.authorization || req.headers.authorization

    if(!authHeaders?.startsWith('Bearer ')){

        //401 unauthorized
        return res.status(401).json({message: "Unauthorized - nu token"});
    }

    // console.log("authHeasers with bearer: ",authHeaders)

    const accessToken = authHeaders.split(" ")[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN,
        (err,decoded) => {

            if(err){

                //403 forbidden
                return res.status(403).json({message: "Forbidden - invalid token"});

            }

            req.role = decoded?.UserInfo?.role 
            req.volunId = decoded?.UserInfo?.volunId

            next()
        }
    )

}

module.exports = verifyJWT;

