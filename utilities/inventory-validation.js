const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/* ***************************
 * Inventory Validation Rules
 * ************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Classification must be selected."),
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),
    body("inv_year")
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Enter a valid year."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
      body('inv_image')
      .trim()
      .custom(value => {
        const isFullUrl = /^(https?:\/\/)/.test(value);
        const isLocalPath = /^\/images\/vehicles\/.+/.test(value);
        if (isFullUrl || isLocalPath) {
          return true;
        }
        throw new Error('Image must be a valid URL or a relative path starting with /images/vehicles/');
      }),
    
    body('inv_thumbnail')
      .trim()
      .custom(value => {
        const isFullUrl = /^(https?:\/\/)/.test(value);
        const isLocalPath = /^\/images\/vehicles\/.+/.test(value);
        if (isFullUrl || isLocalPath) {
          return true;
        }
        throw new Error('Thumbnail must be a valid URL or a relative path starting with /images/vehicles/');
      }),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative number."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
    
  ];
};

/* ***************************
 * Check Inventory Data 
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let list = await utilities.buildClassificationList(classification_id);

    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      list,
      errors: errors.array(),
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
  }

  next();
};

/* ***************************
 * Check Update Inventory Data (Edit Form)
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    console.log("Validation errors:", errors.array())

    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }

  next();
};

module.exports = validate