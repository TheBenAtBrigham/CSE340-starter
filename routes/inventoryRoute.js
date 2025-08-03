

// Needed resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const invController = require("../controllers/invController");
const accController = require("../controllers/accountController");
const inventoryValidation = require("../utilities/inventory-validation");

// Management view
//router.get("/", invController.buildManagementView);

router.get("/", 
    utilities.checkLogin,
    accController.requireAdmin,
    utilities.handleErrors(invController.buildManagementView)
)


// Add Classification
router.get("/addClassification", 
    utilities.checkLogin,
    accController.requireAdmin,
    utilities.handleErrors(invController.buildAddClassificationView));
router.post(
  "/addClassification",
  utilities.handleErrors(invController.buildAndAddClassification)
);

// Add Inventory
router.get("/addInventory", 
    utilities.checkLogin,
    accController.requireAdmin,
    utilities.handleErrors(invController.buildAndAddInventory));
router.post(
  "/addInventory",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkInventoryData,
  utilities.handleErrors(invController.buildAndAddInventory)
);

// View inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

// View individual vehicle detail
router.get("/detail/:inv_id", invController.buildDetailsById);

// JSON inventory by classification_id
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Edit Inventory
router.get("/edit/:inv_id", 
    utilities.checkLogin,
    accController.requireAdmin,
    invController.editInventoryView);

// Update inventory form view (optional confirmation page?)
router.get(
  "/update/",
  utilities.checkLogin,
    accController.requireAdmin,
  utilities.handleErrors(invController.buildUpdateInventoryView)
);

// Submit inventory update
router.post(
  "/update/",
  inventoryValidation.inventoryRules(),
  inventoryValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

//deliver the delete confirmation view
router.get(
    "/delete/:inv_id",
    utilities.checkLogin,
    accController.requireAdmin,
    utilities.handleErrors(invController.deleteView)
)

//process the delete confirmation view
router.post("/delete", utilities.handleErrors(invController.deleteItem))

module.exports = router;