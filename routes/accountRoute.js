//needed resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation")



//"GET" route for the path that will be sent when the "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin));

////"GET" route for the path that will be sent when the "Signup" link is clicked.
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )


module.exports = router;