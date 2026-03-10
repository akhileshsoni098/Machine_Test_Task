const User = require("../model/userModel");

const jwt = require("jsonwebtoken");

// token verification

exports.middileware = async (req, res, next) => {
  try {
    const token = req.headers["token"];

    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "headers token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        return res
          .status(401)
          .json({ status: false, message: "Un-Authenticated User" });
      }

      const user = await User.findById(decoded._id).select({ password: 0 });

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      req.user = user;

    //   console.log(req.user);

      next()

    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
