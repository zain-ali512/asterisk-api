const router = require("express").Router();
const { runAsterisk } = require("../utils/commands");

router.get("/", runAsterisk);

module.exports = router;
