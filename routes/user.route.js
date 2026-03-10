const express = require("express");
const { register, statusUpdate, getDistanceKm } = require("../controllers/user.controller");
const { middileware } = require("../middleware/middi");

const router = express();

router.route("/register").post(register);

router.route("/status").get(middileware,statusUpdate);

router.route("/distance").get(middileware,getDistanceKm);



module.exports = router;
