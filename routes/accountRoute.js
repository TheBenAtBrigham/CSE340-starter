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

    /*(req, res) => {
      res.status(200).send('login process')
    }*/
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

router.get(
    "/logout",
    utilities.handleErrors(accountController.accountOut)
)

//for account management
router.get("/", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

//account editing
router.get("/update", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

router.post("/updated",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.updateAccount)
)



module.exports = router;