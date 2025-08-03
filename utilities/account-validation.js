const utilities = require(".");
const {body, validationResult} = require("express-validator");
const validate = {}
const accountModel = require("../models/account-model")

validate.registrationRules = () => {
    return [
        //name is required and must be string
        body("account_firstname")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a first name."),

        //name is required and must be a string
        body("account_lastname")
        .trim()
        .isString()
        .isLength({min: 2})
        .withMessage("Please provide a last name."),

        //valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // validator.js docs for more information to refer to.
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
              throw new Error("Email exists. Please log in or use different email")
            }
          }),

        //password is required and must be a strong one
        body("account_password")
        .trim()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }).withMessage("Password does not meet requirements.")
    ]
}

validate.loginRules = () => {
    return [
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
        
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required."),
    ];
  };

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password } = req.body;
    const errors = validationResult(req);
    let nav = await utilities.getNav();
  
    if (!errors.isEmpty()) {
      return res.render("account/login", {
        errors,
        title: "Login",
        nav
      });
    }
  
    next();  
  };

module.exports = validate