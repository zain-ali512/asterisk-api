const express = require("express");
const router = express.Router();
const {
  getAllExtn,
  createExtn,
  getOneExtn,
  updateExtn,
  deleteExtn,
} = require("../controllers/extensionsController");

router.route("/ext").get(getAllExtn);
router.route("/ext/new").post(createExtn);
router.route("/ext/:ext_id").get(getOneExtn).put(updateExtn).delete(deleteExtn);

module.exports = router;
