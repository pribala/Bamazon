var mysql      = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'data1sK1ng$10',
  database : 'bamazon',
  multipleStatements: true
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    
  }
  console.log('connected as id ' + connection.threadId);
  displayProducts();
});


function displayProducts() {
 
connection.query('SELECT item_id, product_name, price FROM products', function (error, results, fields) {
  // error will be an Error if one occurred during the query
  // results will contain the results of the query
  // fields will contain information about the returned results fields (if any)
  if(error) throw error;
  console.log("\n=====================================================================\n");
  console.log("Product Id     Product Name         Price");
  results.forEach(function(item){
    console.log(item.item_id, item.product_name, item.price);
  });
  console.log("\n=====================================================================\n");  
  connection.end();
});
}