const verifyRole = (allowedRole) => {
  return (req, res, next) => {
    if (!req?.role && !req?.volunId) {
      return res.status(401).json({ message: `Unauthorized: must be a ${allowedRole}` });
    }

    // console.log("verifyRole, ", req.role, allowedRole)

    const result = req.role.includes(allowedRole);

    if (!result) {
      return res
        .status(401)
        .json({ message: `Unathorized for ${req.role} role` });
    }

    next();
  };
};

module.exports = verifyRole;
