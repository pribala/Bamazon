var mysql      = require('mysql');
var inquirer = require("inquirer");
var Table = require('cli-table');

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
});

inquirer
    .prompt([{
      name: "menu",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
    ]).then(function(answer) {
    	console.log(answer.menu);
      	switch(answer.menu){
      		case "View Products for Sale":
      			listItems();
      			break;
      		case "View Low Inventory":
      			listLowInventory();
      			break;	
      		case "Add to Inventory":
      			addInventory();
      			break;
      		case "Add New Product":
      			addProduct();
      			break;		
      		default:
      			//listItems();
      			break;	
      	}
    });

    function listItems() {
      var table = new Table({
        head: ['Item Id', 'Product Name', 'Price', 'Stock Quantity']
        , colWidths: [15, 60, 15, 20]
      }); 
    	connection.query('SELECT item_id, product_name, price, stock_quantity FROM products', function (error, results, fields) {
	    // error will be an Error if one occurred during the query
	    // results will contain the results of the query
	    // fields will contain information about the returned results fields (if any)
	    if(error) throw error;
	    console.log("Products for Sale");
	    console.log("------------------");
	    results.forEach(function(item){
	    	//console.log("Id: "+ item.item_id + " || Name: " + item.product_name +" || Price: $"+ item.price+" || Quantity: "+item.stock_quantity);
        table.push([item.item_id, item.product_name, "$"+item.price, item.stock_quantity]);
	    });
      console.log(table.toString());
      connection.end();
	   });  
    }

    function listLowInventory(){
      var table = new Table({
        head: ['Item Id', 'Product Name', 'Stock Quantity']
        , colWidths: [15, 65, 20]
      }); 
    	var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
    	connection.query(query, function(err, res) {
    		if(err) throw error;
	    	console.log("Products Low on Inventory");
	    	console.log("--------------------------");
	    	res.forEach(function(item){
	    		//console.log("Id: "+ item.item_id + " || Name: " + item.product_name + " || Quantity: "+item.stock_quantity);
	    	  table.push([item.item_id, item.product_name, item.stock_quantity]);
        });
        console.log(table.toString());
        connection.end();
    	});	
    }

    function addInventory() {
    	console.log("Add more stock");
    	console.log("---------------");
    	inquirer
    		.prompt([{
      			name: "productId",
      			type: "input",
      			message: "Enter product id.",
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
				message: "Enter quantity to order.",
				validate: function(value) {
			        if (isNaN(value) === false) {
			            return true;
			        }
			        console.log(" (Enter a valid number.)");
			        return false;
		        }
			}]).then(function(answer) {
				var itemQuantity = 0;
				connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [parseInt(answer.productId)], function(err, res){
					if(err) throw err;
					itemQuantity = res[0].stock_quantity;
						
				  var newQuantity = parseInt(itemQuantity) + parseInt(answer.quantity);
				
    			var query = connection.query("UPDATE products SET ? WHERE ?", 
    				[
				      {
				        stock_quantity: parseInt(itemQuantity)+parseInt(answer.quantity)
				      },
				      {
				        item_id: parseInt(answer.productId)
				      }
				    ],
    			 function(err, res) {
		      		if (err) throw err;
		      		console.log(res.affectedRows + " product updated!\n");
              listItems();
		    	});	
			 });	
      });  
    }

    function addProduct() {
    	inquirer
    		.prompt([{
      			name: "productName",
      			type: "input",
      			message: "Enter product name.",
      			validate: function(value) {
          			if (value === "") {
            			console.log("Name cannot be null.");
            			return false;
          			}
          		    return true;
        		}
        	},
        	{
				name: "department",
				type: "input",
				message: "Enter department name.",
			},
    		{
				name: "price",
				type: "input",
				message: "Enter price.",
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
				message: "Enter quantity.",
				validate: function(value) {
			        if (isNaN(value) === false) {
			            return true;
			        }
			        console.log(" (Enter a valid number.)");
			        return false;
		        }
    		}]).then(function(answer) {
    			var newItem = {product_name: answer.productName,
    				department_name: answer.department,
    				price: parseFloat(answer.price),
    				stock_quantity: parseInt(answer.quantity)};
    			var query = connection.query("INSERT INTO products SET ?", newItem, function(err, res) {
		      		if (err) throw err;
		      		console.log(res.affectedRows + " product inserted!\n");
              //connection.end();
              listItems();
		    	});	
       	});
    }

