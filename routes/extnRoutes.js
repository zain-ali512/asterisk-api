const router = require("express").Router();
const {
  getExtn,
  createExtn,
  updateExtn,
  deleteExtn,
} = require("../controllers/extnControllerNoDb");

router
  .get("/", getExtn)
  .post("/new", createExtn)
  .put("/:context", updateExtn)
  .delete("/del", deleteExtn);

module.exports = router;
