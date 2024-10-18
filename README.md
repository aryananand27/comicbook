# Comic Book Management API

This is a RESTful API for managing a comic book inventory system. The project allows managers to register, add comic books to their inventory, update and delete comic books, and fetch details of individual or all comic books under a manager. The API supports pagination, sorting, and filtering of the comic books.

## Features

- **Manager Registration**: Register new managers with a role, name, email, and password.
- **Add Comic Books**: Managers can add new comic books to their inventory.
- **Update Comic Books**: Update details of existing comic books under a manager's inventory.
- **Delete Comic Books**: Delete specific comic books from the inventory.
- **View Comic Books**: Fetch details of one or all comic books under a manager.
- **Pagination, Sorting, and Filtering**: Pagination and sorting options for viewing comic books, along with filtering on fields like `authorName`, `yearOfPublication`, and `condition`.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT (JSON Web Token) for Authentication**
- **Cors for Cross-Origin Resource Sharing**

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- A `.env` file with your MongoDB URI and JWT secret key. Add the following environment variables:
  ```env
  JWT_SECRET_KEY=your_secret_key
  MONGODB_URI=your_mongodb_uri
# Installation
## 1. Clone the Repository
First, you need to clone the GitHub repository to your local machine. Run the following command in your terminal:
       git clone https://github.com/aryananand27/comicbook.git
This command will copy the project to your local system.

## 2. Install Dependencies
The project uses Node.js and requires various dependencies listed in the package.json file. To install them, run:
      npm install
This will install all the required packages, including:

- Express.js (for server-side functionality)
- Cors (for handling cross-origin requests)
- Mongoose (for MongoDB interactions)
- JWT (for authentication)

## 3. Create a .env File
The project requires some environment variables for proper configuration (e.g., JWT secret key, MongoDB URI). You need to create a .env file in the root of your project directory.

Here’s how to create it:

1. Run the command to create the .env file:
   touch .env
2. Open the .env file and add the following contents:
    JWT_SECRET_KEY=your_secret_key
    MONGODB_URI=your_mongodb_uri
   * Replace your_secret_key with a secret key for JWT token signing.
   * Replace your_mongodb_uri with your MongoDB connection string.

##  4. Run the Project
   --  After installing the dependencies and setting up the .env file, you can run the server by using:
         npm start

   -- This will start the Express server and the application will be running on http://localhost:7000.

   -- You should see the message:

   -- Listening on port 7000

## 5. Test the API
  -- You can now test the API using any tool like Postman, Insomnia, or curl by making requests to the appropriate endpoints.

   --  For example, to test if the server is running, visit:
          GET http://localhost:7000/

   You should get a response saying:
      Hello

## 6. API Endpoints
 * Once your server is running, you can interact with all the available API routes mentioned in the earlier section, such as:

    * Registering a manager: POST /register
    * Adding a comic book: PUT /addInInventory
    * Updating a comic book: PUT /updateAComicBook/:managerId/:BookId
    * Fetching all comic books with pagination, filtering, and sorting: GET /getAllComicBooks/:managerId
    * Deleting a comic book : Delete /removeAComicBook/:managerId/:BookId
## Running Tests
  You can test the endpoints using a tool like Postman or Curl by hitting the appropriate routes with the required parameters and body.
  Link for PostMan Collection:- https://www.postman.com/aryan2003/comicbook/collection/ohagutr/new-collection?action=share&creator=32161965
