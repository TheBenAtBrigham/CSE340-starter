//needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//rout to build the details of a vehicle
router.get("/detail/:inv_id", invController.buildDetailsById);

//route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


module.exports = router;