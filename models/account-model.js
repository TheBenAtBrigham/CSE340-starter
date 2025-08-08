
const pool = require("../database/index")

async function getAccounts(){
    const result = await pool.query("SELECT * FROM public.account ORDER BY account_email");
    //console.log(result);
    return result;
}

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }


/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query('SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1', [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

async function updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password,
    account_id,
  ) {
    try {
      const sql =
        "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, account_password = $4 WHERE account_id = $5 RETURNING *"
      const data = await pool.query(sql, [
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_id

      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }


async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    throw new Error("No matching account ID found")
  }
}

async function deleteAccountByEmail(account_email) {
    try {
        const sql = "DELETE FROM account WHERE account_email = $1 RETURNING *"
        const data = await pool.query(sql, [account_email])
        //console.log("Deleting account with email:", account_email);
        return data.rowCount > 0;
    } catch (error) {
        console.error("Delete User Error: ", error);
        throw new Error("Error deleting account.");
    }
    
}

module.exports = { getAccounts, registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, deleteAccountByEmail}