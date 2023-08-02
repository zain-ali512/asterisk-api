const router = require("express").Router();
const {
  getAllSip,
  createSip,
  getOneSip,
  updateSip,
  deleteSip,
} = require("../controllers/sipControllerNoDb");

router
  .get("/", getAllSip)
  .post("/new", createSip)
  .get("/:sip_id", getOneSip)
  .put("/:sip_id", updateSip)
  .delete("/:sip_id", deleteSip);

module.exports = router;
