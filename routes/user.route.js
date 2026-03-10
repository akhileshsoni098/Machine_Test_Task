const express = require("express");
const { register, statusUpdate } = require("../controllers/user.controller");
const { middileware } = require("../middleware/middi");

const router = express();

router.route("/register").post(register);


router.route("/status").get(middileware,statusUpdate);





module.exports = router;
