
const verifyRole = (allowedRole)=> {

    return (req,res, next) => {

        if(!req?.role){
            return res.status(401).json({message: "UnAthorized - no role"})
        }

        console.log(req.role, allowedRole)

        const result = req.role.includes(allowedRole)

        if(!result){
            return res.status(401).json({message: `Unathorized for ${req.role} role`})

        }

        next()
    }
}

module.exports = verifyRole