//needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index");
const invController = require("../controllers/invController")
const classValidate = require("../utilities/class-validation")

//Management route
router.get("/", invController.buildManagementView);


//route to build the details of a vehicle
router.get("/detail/:inv_id", invController.buildDetailsById);

//route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//route to get the add classification
router.get("/addClassification", invController.buildAddClassificationView);

//post the add classification
router.post("/addClassification", 

    utilities.handleErrors(invController.buildAndAddClassification)
);

//route to get the add classification
router.get("/addInventory", invController.buildAndAddInventoryView);

//post the add classification
router.post("/addInventory", 

    utilities.handleErrors(invController.buildAndAddInventory)
);


module.exports = router;