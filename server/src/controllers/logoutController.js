
const logout= (req, res) => {

    const cookies = req.cookies

    
    if(!cookies?.jwt){

        //chg to 204 ltr
        return res.status(401).json({message: "UnAuthenticated - no cookies"})

    }

    //same options as refreshToken from authController
    res.clearCookie('jwt',
    {
        httpOnly: true,
        sameSite: "None",
        secure: true,
       
    })

    
    res.json({message: "cookie jwt cleared"});

}

module.exports = {logout};
