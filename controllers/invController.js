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
    const classification_name = data[0].classification_name
    res.render("./inventory/classification", {
        title: classification_name + " vehicles",
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management Page",
    nav, 
    errors: null,
    classificationSelect,
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
    inv_color,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  //const itemData = await invModel.getInventoryById(inv_id)
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id

  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", itemName+' was successfully updated.')
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id, 
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

invCont.buildUpdateInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/update", {
    title: "Your vehicle was updated",
    nav,
  });
}

invCont.deleteView =  async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav, 
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

invCont.deleteItem =  async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)

  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", "The deletion was successful.")
    res.redirect('/inv/')
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect('/inv/delete/inv_id')
  }
}

module.exports = invCont