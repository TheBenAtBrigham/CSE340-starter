const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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




module.exports = invCont