const express = require("express");
const { register } = require("../controllers/user.controller");

const router = express();

router.route("/register").post(register);

module.exports = router;
