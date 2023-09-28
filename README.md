# E-Commerce-API

## Overview

The E-Commerce API is a robust application developed using Node.js and MongoDB, designed to facilitate e-commerce operations efficiently.

## Getting Started

To utilize this API, follow these steps:

1. Initialize the project by running the "npm init" command within the project's directory.
2. Start the server using the "node index.js" command.
3. Employ Postman for API testing.
4. Utilize a GET request to access product information at "localhost:8000/products."

## Creating New Products

To add a new product to the inventory, adhere to these steps:

1. Launch the server with the "node app.js" command.
2. Open Postman.
3. Set the URL to "localhost:8000/products/create."
4. In the Body tab, select "raw" and choose JSON from the dropdown.
5. Input product details as follows:

   ```json
   {
     "name": "laptop",
     "quantity": 10
   }
Execute a POST request.
If you receive a confirmation message indicating successful product addition, your action was successful.
The new product has been added; verify by issuing a GET request to "localhost:8000/products."

## Deleting a Product
To remove a product from the inventory, follow these steps:

Copy the unique object ID of the product you wish to delete.
Append the ID after "localhost:8000/products/" in the URL.
Execute a DELETE request.
You will receive a confirmation message confirming successful deletion.

## Updating Product Quantity
To modify the quantity of a product, use the following steps:

Copy the object ID of the target product.
Insert the ID after "localhost:8000/products/" in the URL.
After the ID, add "/update_quantity/?number={x}" to the URL, where 'x' represents the quantity change value.
The complete URL should appear as "localhost:8000/products/{id}/update_quantity/?number={x}."
Execute a POST request.
You will receive a confirmation message containing the updated product details.
Technology Stack
This application leverages the Node.js runtime environment and utilizes MongoDB as its database backend, ensuring scalability and efficient data management.