const express = require("express");
const router = express.Router();
const {
  getAllExtn,
  createExtn,
  getOneExtn,
  updateExtn,
  deleteExtn,
} = require("../controllers/extnControllerNoDb");

router.route("/").get(getAllExtn);
router.route("/new").post(createExtn);
router.route("/ext_id").get(getOneExtn).put(updateExtn).delete(deleteExtn);

module.exports = router;
