const express = require("express");
const router = express.Router();
const {
  getAllSip,
  createSip,
  getOneSip,
  updateSip,
  deleteSip,
} = require("../controllers/sipControllerNoDb");

router.route("/").get(getAllSip);
router.route("/new").post(createSip);
router.route("/sip_id").get(getOneSip).put(updateSip).delete(deleteSip);

module.exports = router;
