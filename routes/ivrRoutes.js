const router = require("express").Router();
const { getIvr } = require("../controllers/ivrControllerNoDb");
const { createIvr } = require("../controllers/ivrControllerNoDb");

router.get("/getIvr", getIvr).post("/create", createIvr);
module.exports = router;
