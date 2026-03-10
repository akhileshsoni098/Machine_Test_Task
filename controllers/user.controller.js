const User = require("../model/userModel");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

//===================== Register / Login User ======

exports.register = async (req, res) => {
  try {
    const { name, email, password, address, latitude, longitude } = req.body;

    // name validation

    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name is required" });
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid name",
      });
    }

    // email validation

    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    if (typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid email",
      });
    }

    // check user Already registered

    const checkUser = await User.findOne({ email: email });

    if (!password) {
      return res
        .status(400)
        .json({ status: false, message: "Password is required" });
    }

    if (typeof password !== "string" || password.trim().length === 0) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid password",
      });
    }
    // user Already exist
    if (checkUser) {
      // will perform login after verifying passowrd token will generate from here proper response will sent to the client

      const match = await bcrypt.compare(password, checkUser.password);

      if (!match) {
        return res.status(400).json({
          status: false,
          message: "Invalid Email Or Password",
        });
      }

      const token = jwt.sign({ _id: checkUser._id }, process.env.JWT_SECRET);

      const response = {
        name: checkUser.name,
        email: checkUser.email,
        address: checkUser.address,
        latitude: checkUser.latitude,
        longitude: checkUser.longitude,
        status: checkUser.status,
        register_at: checkUser.createdAt,
        token: token,
      };
      return res.status(200).json({
        status_code: "200",
        message: "User LogIn Successfully",
        data: response,
      });
    }

    // password hashing

    const hashedPassword = await bcrypt.hash(password, 10);

    // address if provided

    if (address) {
      if (typeof address !== "string" || address.trim().length === 0) {
        return res.status(400).json({
          status: false,
          message: "Please Provide Valid Address",
        });
      }
    }

    // latitude validation

    if (!latitude) {
      return res
        .status(400)
        .json({ status: false, message: "latitude is required" });
    }

    const lat = Number(latitude);

    if (isNaN(lat)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid latitude",
      });
    }

    // longitude validation

    if (!longitude) {
      return res
        .status(400)
        .json({ status: false, message: "longitude is required" });
    }

    const long = Number(longitude);

    if (isNaN(long)) {
      return res.status(400).json({
        status: false,
        message: "Please provide a valid longitude",
      });
    }

    const saveUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      latitude: lat,
      longitude: long,
      status: "active",
    });

    if (!saveUser) {
      return res.status(400).json({
        status: false,
        message: "Something wents wrong in user registration/login",
      });
    }

    const token = jwt.sign({ _id: saveUser._id }, process.env.JWT_SECRET);

    const response = {
      name: saveUser.name,
      email: saveUser.email,
      address: saveUser.address,
      latitude: saveUser.latitude,
      longitude: saveUser.longitude,
      status: saveUser.status,
      register_at: saveUser.createdAt,
      token: token,
    };

    return res.status(200).json({
      status_code: "200",
      message: "User LogIn Successfully",
      data: response,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// =========== cahnge user status(active to inactive voicevarsa) token required in the headers ===

exports.statusUpdate = async (req, res) => {
  try {
    // condition
    // status === "active" ? "inactive" : "active"

    const statusUpdate = await User.updateMany(
      {},
      [
        {
          $set: {
            status: {
              $cond: [{ $eq: ["$status", "active"] }, "inactive", "active"],
            },
          },
        },
      ],
      { updatePipeline: true },
    );

    // console.log("statusUpdate", statusUpdate);

    res
      .status(200)
      .json({ status_code: "200", message: "Status Updated successfully" });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
