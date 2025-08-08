'use strict'

let accountList = document.querySelector('#accountList')

accountList.addEventListener("change", async function(){
    let account_id = accountList.value
    console.log(`Selected accountId: ${account_id}`);
    buildAccountbyEmail(account_id)
})


function buildAccountbyEmail(data) {
    let accountDisplay = document.getElementById("accountDisplay"); 
    // table labels are set out here
    let dataTable = '<thead>'; 
    /*dataTable += '<tr><th>Username</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 

    dataTable += '<tbody>'; */

    // Iterate over all vehicles in the array and put each in a row 

    //dataTable += `<tr><td>${data} ${data.account_firstname} ${data.account_lastname}</td>`; 
    //dataTable += `<td><a href='/account/delete/${data}' title='Click to edit'>Delete</a></td></tr>`; 
    dataTable += `<td><a href='/account/delete/${data}' title='Click to delete'>Delete</a></td></tr>`; 

    dataTable += '</tbody>'; 
 

    accountDisplay.innerHTML = dataTable;

}