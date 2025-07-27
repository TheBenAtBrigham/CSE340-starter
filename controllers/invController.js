const invModel = require("../models/inventory-model")
const utilities = require("../utilities/index")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav, 
        grid,
    })
}

invCont.buildDetailsById = async function(req, res, next) {
    try {
      const inv_id = req.params.inv_id;
      const vehicle = await invModel.getVehicleById(inv_id);
  
      if (!vehicle) {
        const err = new Error('Vehicle not found');
        err.status = 404;
        throw err;
      }
  
      const grid = await utilities.buildClassificationDetails(inv_id);
      const nav = await utilities.getNav();
      res.render("./inventory/detail", {
        title: `${vehicle.inv_make} ${vehicle.inv_model}`,
        nav,
        grid,
      });
    } catch (err) {
      next(err);  
    }
};

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management Page",
    nav, 
  });
}

invCont.buildAddClassificationView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add new classification",
    nav,
  });
}

invCont.buildAndAddClassification = async function (req, res) {
  // Insert model function here
  
  let nav = await utilities.getNav()
  
  
  const class_name = req.body.classification_name

  try {
    const result = await invModel.addClassification(class_name);

    if (result && result.rows && result.rows.length > 0) {
      const newClassName = result.rows[0].classification_name;
      req.flash("notice", `Congrats, ${newClassName} was added.`);
      return res.redirect("/inv"); // ✅ prevents duplicate inserts
    } else {
      req.flash("notice", "Sorry, couldn't add the classification.");
      return res.status(500).render("inventory/add-classification", {
        title: "Add new classification",
        nav,
      });
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "An unexpected error occurred.");
    return res.status(500).render("inventory/add-classification", {
      title: "Add new classification",
      nav,
    });
  }
}

invCont.buildAndAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let list = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add new inventory",
    nav,
    list,
    errors: null,
    formData: {},
  });
}

invCont.buildAndAddInventory = async function (req, res, next) {
  
  
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
    inv_color
  } = req.body

  let nav = await utilities.getNav()

  try {
    // Call the model to insert the new vehicle
    const invResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )


    if (invResult.rowCount > 0) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
      return res.redirect("/inv")
    } else {
      throw new Error("Insert failed")
    }
  } catch (error) {
    console.error("Error inserting inventory:", error.message)
    const list = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Could not add vehicle")
    return res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      list,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }
}







module.exports = invCont