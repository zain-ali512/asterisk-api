const router = require("express").Router();
const {
  getAllExtensions,
  addExtension,
  getOneExtension,
  updateExtension,
  deleteExtension,
  deleteContext,
} = require("../controllers/extnControllerNoDb");

router
  .get("/", getAllExtensions)
  .post("/new", addExtension)
  .get("/:context/:extension", getOneExtension)
  .put("/:context/:extension", updateExtension)
  .delete("/:context/:extension", deleteExtension)
  .delete("/:context", deleteContext);

module.exports = router;
