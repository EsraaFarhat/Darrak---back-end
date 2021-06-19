const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { CraftMan, validate } = require("../models/craftman");
const CraftManController = require("../controllers/CraftManController");
// const _ = require("lodash");
// const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(auth, CraftManController.getAllCraftMen)
  .post(auth, isAdmin, CraftManController.createCraftMan);

router
  .route("/:id")
  .get(auth, CraftManController.getCraftMan)
  .patch(auth, isAdmin, CraftManController.updateCraftMan)
  .delete(auth, isAdmin, CraftManController.deleteCraftMan);

module.exports = router;
