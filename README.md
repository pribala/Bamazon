# Bamazon
An Amazon-like storefront using Node.js & MySQL


   The app takes in orders from customers and depletes stock from the    store's inventory. It also tracks product sales across store's    departments and provides a summary of the highest-grossing    departments in the store.

### Video and Screenshots

[http://recordit.co/Gc9l3AWTlj] 

[http://g.recordit.co/ehAmRPtv6B.gif]

[http://g.recordit.co/MIhGlsyHcD.gif]

[http://g.recordit.co/o0hxkJdmHV.gif]

[http://g.recordit.co/9I7H3yKWLW.gif]

[http://g.recordit.co/LwhnO12GWc.gif]

[http://g.recordit.co/MUbAsFmP5p.gif]

[http://g.recordit.co/p3wWWACW0W.gif]

[http://g.recordit.co/4KeKnfL59e.gif]

[http://g.recordit.co/Kji4izwFIM.gif]

[http://g.recordit.co/ihOzY0YM7Q.gif]


### Customer View

   Running this application first displays all of the items available    for sale.

   The app then prompts users for the ID of the product they would like    to buy and how many units of the product they would like to buy.

   Once the customer has placed the order, the application checks if the    store has enough of the product to meet the customer's request.

   If not, the app displays the message Insufficient quantity!, and then    prevents the order from going through.

   If the store does have enough of the product, it fulfills the    customer's order and updates the SQL database to reflect the    remaining quantity.

   Once the update goes through, it shows the customer the total cost of    their purchase.

### Manager View

Running this application will:

1. List a set of menu options:

2. View Products for Sale

3. View Low Inventory

4. Add to Inventory

5. Add New Product

If a manager selects View Products for Sale, the app lists every    available item with their ids, names, prices, and quantities.

If a manager selects View Low Inventory, then it lists all items with    an inventory count lower than five.

If a manager selects Add to Inventory, the app displays a prompt that    will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it allows the manager to add a    completely new product to the store.


### Supervisor View

Running this application will list a set of menu options:

1. View Product Sales by Department

2. Create New Department

When a supervisor selects View Product Sales by Department, the app     displays a summarized table in their terminal/bash window.

The total_profit column is calculated on the fly using the difference    between over_head_costs and product_sales. A negative value indicates sales is less than overhead costs indicating a loss.

### Installation

Download the application from GitHub.

Run the schema.sql file to create:

1. Bamazon database
2. Products table
3. Departments table

Run the seeds.sql file to populate the database with values.
   
Run npm install to install the dependencies from package.json.

To run the three modules use: 

1. node bamazonCustomer.js
2. node bamazonManager.js
3. node bamazonSupervisor.js


### Packages Used

1. inquirer: For command line user interfaces.
2. mysql: node.js driver for mysql.
3. cli-table : To log the table to the console.
   	 
