const express = require("express");
const router = express.Router();
const {
  getAllSip,
  createSip,
  getOneSip,
  updateSip,
  deleteSip,
} = require("../controllers/sipController");

router.route("/ext").get(getAllSip);
router.route("/ext/new").post(createSip);
router.route("/ext/:ext_id").get(getOneSip).put(updateSip).delete(deleteSip);

module.exports = router;
