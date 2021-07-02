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

router.get('/get/count', [auth, isAdmin], async (req,res)=>{
  const craCount = await CraftMan.countDocuments((count)=> count)
  if(!craCount){
      res.status(500).json({
          success: false
      })
  }
  res.send({
      count: craCount
  });
})

module.exports = router;
