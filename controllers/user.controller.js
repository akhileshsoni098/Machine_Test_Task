const User = require("../model/userModel");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { getDistance } = require("../utils/getDistance");

//===================== Register / Login User ======
const validEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{3}$/;

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


    if (!validEmail.test(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Kindly provide valid email" });
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

    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        status: false,
        message: "latitude should be between -90 and 90",
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

    if (long < -180 || long > 180) {
      return res.status(400).json({
        status: false,
        message: "Longitude should be between -180 and 180",
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
      message: "User Registered Successfully",
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

// ========= get Distance get Api destination lat & long in query params =======

exports.getDistanceKm = async (req, res) => {
  try {
    const { destinationLat, destinationLong } = req.query;

    // validation latitude

    if (!destinationLat) {
      return res.status(400).json({
        status: false,
        message: "Please Provide Destination_Latitude",
      });
    }

    const distLat = Number(destinationLat);

    if (isNaN(distLat)) {
      return res.status(400).json({
        status: false,
        message: "Please Provide valid Destination_Latitude",
      });
    }

    if (distLat < -90 || distLat > 90) {
      return res.status(400).json({
        status: false,
        message: "latitude should be between -90 and 90",
      });
    }

    // validation longitude

    if (!destinationLong) {
      return res.status(400).json({
        status: false,
        message: "Please Provide  Destination_Longitude",
      });
    }

    const distLong = Number(destinationLong);

    if (isNaN(distLong)) {
      return res.status(400).json({
        status: false,
        message: "Please Provide valid Destination_Longitude",
      });
    }

    if (distLong < -180 || distLong > 180) {
      return res.status(400).json({
        status: false,
        message: "Longitude should be between -180 and 180",
      });
    }

    const { latitude, longitude } = req.user;

    const distance = getDistance(latitude, longitude, distLat, distLong);

    // console.log("distance", distance);

    return res.status(200).json({
      status_code: "200",
      message: "Distance calculated sucessfully",
      distance: `${distance.toFixed(3)}km`,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

/* 
 This API will return users based on the day they registered.
 Users must be grouped day-wise.
*/

exports.getUserListing = async (req, res) => {
  try {
    let { week_number } = req.query;

    week_number = week_number.split(",");

    week_number = week_number.map((n) => {
      Number(n);
      if (n > 6 || n < 0) {
        return res
          .status(400)
          .json({ status: false, message: `Invalid day of week is ${n}` });
      } else {
        return Number(n);
      }
    });

    // console.log(typeof week_number)

    // return res.json(week_number)

    const mongoDays = week_number.map((d) => d + 1);

    // validation

    const users = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          dayOfWeek: { $dayOfWeek: "$createdAt" },
        },
      },
      {
        $match: {
          dayOfWeek: { $in: mongoDays },
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          users: {
            $push: {
              name: "$name",
              email: "$email",
            },
          },
        },
      },
    ]);

    const dayMap = {
      1: "sunday",
      2: "monday",
      3: "tuesday",
      4: "wednesday",
      5: "thursday",
      6: "friday",
      7: "saturday",
    };

    let data = {};

    users.forEach((item) => {
      data[dayMap[item._id]] = item.users;
    });

    return res.status(200).json({
      status_code: 200,
      message: "User listing fetched successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
