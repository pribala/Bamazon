DROP DATABASE IF EXISTS bamazon;

-- Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon --
CREATE TABLE products
(
  -- Creates a numeric column called "item_id" which will automatically increment its default value as we create new rows --
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "product_name" which cannot contain null --
  product_name VARCHAR (100) NOT NULL,
  -- Makes a string column called "department_name" --
  department_name VARCHAR (100),
  -- Makes a numeric column called "price" --
  price DECIMAL(10,2) NOT NULL,
  -- Makes an numeric column called "stock_quantity" --
  stock_quantity INTEGER(10),
  -- Sets item_id as this table's primary key which means all data contained within it will be unique --
  PRIMARY KEY(item_id)
);