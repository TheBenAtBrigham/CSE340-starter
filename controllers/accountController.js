const utilities = require("../utilities/index");
const accModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "You're not signed in, Please sign in.")
    res.render("account/login", {
        title: "Log in",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "You're not signed in, Please sign in.")
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
    
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body


    let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }


    const regResult = await accModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )


    if (regResult) {
        req.flash("notice", 
        `Congrats, you\'re registered, ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
    
} 

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        console.log("Login successful, redirecting to /account/");

        return res.redirect("/account/")
      }
      else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
  }
  

async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()

    req.flash("notice", "This is the management page.")
    res.render("account/index", {
        title: "Account Management",
        nav,
        loggedin: res.locals.loggedin,
        accountData: res.locals.accountData,
        name: res.locals.accountData.account_firstname
    })
}

async function verifyAuth(req, res, next) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        console.log("Login successful, redirecting to /account/");

        return res.redirect("/account/")
      }
      else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
}

async function accountOut(req, res) {
    res.clearCookie("jwt");
    req.flash("notice", "You have logged out successfully.")
    res.redirect("/");
}

async function requireAdmin(req, res, next){
    const user = res.locals.accountData
    if (!user || user.account_type === "Client") {
        req.flash("notice", "Access denied.")
        return res.redirect("/")
    }
    next()
}

async function buildUpdateAccount(req, res) {
    let nav = await utilities.getNav()
    req.flash("notice", 'Please enter your new profile details')
    try {
        const account_email = res.locals.accountData.account_email
        const accountData = await accModel.getAccountByEmail(account_email)
        res.render("account/update", {
        title: "Update your account",
        nav,
        //errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id
        
     
        })
    } catch {
        console.error("Error retrieving account data:", error);
        req.flash("error", "Error retrieving account details.");
        res.redirect("/account/login");
    }

    
}

async function updateAccount(req, res, next) {
    let nav = await utilities.getNav()

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id
    
  } = req.body


  const accountIdInt = parseInt(account_id,10)

  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }


  const updateResult = await accModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
    accountIdInt

  )
  
  if (updateResult) {
    delete updateResult.account_password
        const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }


    const userName = updateResult.account_firstname + " " + updateResult.account_lastname 
    req.flash("notice", "Account for "+userName+' was successfully updated.')
    res.redirect("/account/")
  } else {
    const userName = `${account_firstname} ${account_lastname}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit account for " + userName,
      nav,
      errors: null,
      account_id: accountIdInt,
      account_firstname,
        account_lastname,
        account_email,
        account_password,
        
    })
}
}

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, verifyAuth, accountOut, requireAdmin, buildUpdateAccount, updateAccount}