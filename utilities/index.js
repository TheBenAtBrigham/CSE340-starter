const invModel = require("../models/inventory-model")
const accModel = require("../models/account-model")
const jwt = require('jsonwebtoken');
require("dotenv").config();

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  
  list += '<a href="/" title="Home page"><li>Home</li></a>'
  data.rows.forEach((row) => {
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles"><li>' +
      row.classification_name +
      "</li></a>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data){
    let grid
    if (data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            + '" alt=Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
            grid += '<hr>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicles information and details
* ************************************ */
Util.buildClassificationDetails = async function (inv_id){
  let vehicle = await invModel.getVehicleById(inv_id);

  let grid = '';

  if (vehicle) {
    grid = '<a class="back" href="/inv/type/' + vehicle.classification_id + '" title="Back to ' + vehicle.classification_name + ' vehicles">← Back to ' + vehicle.classification_name + ' vehicles</a>'
    grid += '<div id="inv-detail">'
  
    grid += '<div class="v-details-img"><img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" /></div>'
    grid += '<div class="vehicle-details">'
    grid += '<h1>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
    grid += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    grid += '<p><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
    grid += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
    grid += '</div>'
    grid += '</div>'
} else {
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid;
}

/* **************************************
* Build the vehicles information and details
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null && 
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

Util.buildAccountList = async function (account_id = null){
  let result = await accModel.getAccounts()

  let data = result.rows;

  let accountList = '<select name="account_id" id="accountList" required>';

  data.forEach((row) => {
    accountList += '<option value="' + row.account_id + '"'
    if (
      account_id != null && 
      row.account_id == account_id
    ) {
      accountList += " selected "
    }
    accountList += ">" + row.account_email+ "</option>"
  })
  accountList += "</select>"
  return accountList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
      })   
  } else {
    next()
  }
}

/* **************************************
* Check Login
* For Unit 5, jwt authorize activity
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util

