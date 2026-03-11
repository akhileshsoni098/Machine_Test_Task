const express = require("express");
const { register, statusUpdate, getDistanceKm, getUserListing } = require("../controllers/user.controller");
const { middileware } = require("../middleware/middi");

const router = express();

router.route("/register").post(register);

router.route("/status").get(middileware,statusUpdate);

router.route("/distance").get(middileware,getDistanceKm);

router.route("/listing").get(middileware,getUserListing);



module.exports = router;
