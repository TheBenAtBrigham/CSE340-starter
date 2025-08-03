const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/*async function getClassificationById(classification_id) {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1 ORDER BY classification_name",
       [classification_id]
    )
    return data.rows[0]
}*/

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(`SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id])
      return data.rows
    } catch (error) {
        console.error("getclassificationbyid error " + error)
    }
}

async function getVehicleById(inv_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.inv_id = $1`,
           [inv_id]
        )
        return data.rows[0];
    } catch (err) {
        console.error("Error fetching the vehicle: ", err)
        throw err;
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
        
    } catch (error) {
        return error.message
    }
}

async function checkExistingClassification(){
    try {
      const sql = "SELECT 1 FROM classification WHERE classification_name = $1 LIMIT 1"
      const classify = await pool.query(sql, [classification_name])
      return classify.rowCount
    } catch (error) {
      return error.message
    }
  }

  async function addInventory(
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
  ) {
    const sql = `INSERT INTO inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
  
    return await pool.query(sql, [
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
    ])
  }

  /* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
  ) {
    try {
      const sql =
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
  }

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        new Error("Delete Inventory Error")
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, checkExistingClassification, addInventory, updateInventory, deleteInventoryItem}
