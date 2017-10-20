// Import the required packages
var mysql      = require('mysql');
var inquirer = require("inquirer");
var Table = require('cli-table');
 
// Create database connection parameters
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'data1sK1ng$10',
  database : 'bamazon',
  multipleStatements: true
});
 
// Connect to the database and display list of products
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  }
  // console.log('connected as id ' + connection.threadId);
  displayProducts();
});

// Function displays list of all products 
function displayProducts() {
  // instantiate table 
  var table = new Table({
      head: ['Item Id', 'Product Name', 'Price']
    , colWidths: [15, 65, 20]
  }); 
  
connection.query('SELECT item_id, product_name, price FROM products', function (error, results, fields) {
  // error will be an Error if one occurred during the query
  // results will contain the results of the query
  // fields will contain information about the returned results fields (if any)
  if(error) throw error;
  console.log("Products for Sale");
  console.log("-----------------");
  results.forEach(function(item){
    //console.log("Id: "+ item.item_id + " || Name: " + item.product_name +" || Price: "+ item.price);
    table.push([item.item_id, item.product_name, "$"+item.price]);
  });
  console.log(table.toString());
  inquirer
    .prompt([{
      name: "id",
      type: "input",
      message: "Enter the Id of the product you would like to purchase.",
      validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          console.log(" (Enter a valid number.)");
          return false;
        }
    },
    {
      name: "quantity",
      type: "input",
      message: "Enter the quantity you would like to purchase.",
      validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          console.log(" (Enter a valid number.)");
          return false;
        }
    }
    ]).then(function(answer) {
      updateQuantity(answer.id, answer.quantity);
    });
  });
}

function updateQuantity(id, quantity) {
  var query = "SELECT stock_quantity, price, product_sales FROM products WHERE ?";
  connection.query(query, { item_id: id }, function(err, res) {
    res.forEach(function(item){
      if(item.stock_quantity < quantity){
        console.log("Insufficient quantity!");
        console.log("Sorry, order cannot be placed!");
        connection.end(); 
      }else {
        var newQuantity = item.stock_quantity - quantity;
        var total_sales = item.product_sales + (quantity * item.price);
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query,
        [
          {
            stock_quantity: newQuantity,
            product_sales: total_sales
          },
          {
            item_id: id
          }
        ],
        function(err, result) {
          if (err) throw err;
          res.forEach(function(item){
            console.log("Your order has been placed!");
            console.log("Total cost of purchase: $"+ Math.round(item.price*quantity*100)/100);
          });
          displayProductById(id);
          //connection.end();  
        });
      }  
    });  
  }); 
}

//Function displays product filtered by id
function displayProductById(id){
  var table = new Table({
      head: ['Item Id', 'Product Name', 'Total Sales']
    , colWidths: [15, 65, 20]
  }); 
  
connection.query('SELECT item_id, product_name, product_sales FROM products WHERE ?',{item_id: id}, function (error, results, fields) {
  // error will be an Error if one occurred during the query
  // results will contain the results of the query
  // fields will contain information about the returned results fields (if any)
  if(error) throw error;
  console.log("Product Sale Details");
  console.log("---------------------");
  results.forEach(function(item){
    //console.log("Id: "+ item.item_id + " || Name: " + item.product_name +" || Price: "+ item.price);
    table.push([item.item_id, item.product_name, "$"+item.product_sales]);
  });
  console.log(table.toString());
  connection.end();
  });
}
