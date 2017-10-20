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
 
// Connect to the database  
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
  }
});

// Display list of options
inquirer
    .prompt([{
      name: "menu",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department"]
    }
    ]).then(function(answer) {
        switch(answer.menu){
          case "View Product Sales by Department":
            displaySummaryTable();
            break;
          case "Create New Department":
            createNewDepartment();
            break;  
          default:
            listDepartments();
            break;  
        }
    });

    // Display summary table
    function displaySummaryTable() {
      var table = new Table({
        head: ['Department Id', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
        , colWidths: [15, 30, 18, 15, 22]
      }); 
      var query = 'SELECT department_id, department_name, over_head_costs, sales, (sales - over_head_costs) AS total_profit FROM (SELECT department_id, departments.department_name, over_head_costs, COALESCE(SUM(product_sales),0) AS sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name) AS summary ORDER BY total_profit DESC';
      connection.query(query, function (error, results, fields) {
        if(error) throw error;
        results.forEach(function(item){
          table.push([item.department_id, item.department_name, item.over_head_costs, item.sales, item.total_profit]);
        });
        console.log(table.toString());
        connection.end();
      });
    }

    // Create new department
    function createNewDepartment() {
      inquirer
        .prompt([{
            name: "departmentName",
            type: "input",
            message: "Enter department name.",
            validate: function(value) {
                if (value === "") {
                  console.log("Name cannot be null.");
                  return false;
                }
                  return true;
            }
          },
        {
        name: "overheadCost",
        type: "input",
        message: "Enter overhead costs.",
        validate: function(value) {
              if (isNaN(value) === false) {
                  return true;
              }
              console.log(" (Enter a valid number.)");
              return false;
            }
        }]).then(function(answer) {
          var newDepartment = {department_name: answer.departmentName,
            over_head_costs: parseFloat(answer.overheadCost)};
          var query = connection.query("INSERT INTO departments SET ?", newDepartment, function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " department added!\n");
              listDepartments();
          }); 
        });
    }

    // List departments
    function listDepartments() {
      var table = new Table({
        head: ['Department Id', 'Department Name', 'Overhead Costs']
        , colWidths: [20, 60, 30]
      }); 
      connection.query('SELECT department_id, department_name, over_head_costs FROM departments', function (error, results, fields) {
      // error will be an Error if one occurred during the query
      // results will contain the results of the query
      // fields will contain information about the returned results fields (if any)
      if(error) throw error;
      console.log("Departments");
      console.log("------------");
      results.forEach(function(item){
        table.push([item.department_id, item.department_name, "$"+item.over_head_costs]);
      });
      console.log(table.toString());
      connection.end();
     });  
    }