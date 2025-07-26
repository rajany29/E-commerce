# E-Shop API

A RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- User Authentication and Authorization
- Product Management
- Category Management
- Order Processing
- File Upload Support
- Secure API with JWT
- Input Validation
- MongoDB Database Integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Joi** - Input validation
- **Morgan** - HTTP request logger
- **Cors** - Cross-origin resource sharing

## Project Structure

```
├── config/
│   ├── db.js           # Database configuration
│   ├── utils.js        # Utility functions
│   └── Validation.js   # Input validation schemas
├── controller/
│   └── user_controller.js  # User related controllers
├── model/
│   ├── category.js     # Category model
│   ├── order.js        # Order model
│   ├── orderItem.js    # Order item model
│   ├── product.js      # Product model
│   └── user.js         # User model
├── public/
│   └── uploads/        # Uploaded files storage
├── routes/
│   ├── categories.js   # Category routes
│   ├── orders.js       # Order routes
│   ├── products.js     # Product routes
│   └── users.js        # User routes
├── server.js           # Application entry point
└── package.json        # Project dependencies
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   API_URL=/api/v1
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Users
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users` - Get users list (admin)

### Products
- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create a new product (admin)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create a new category (admin)
- `DELETE /api/v1/categories/:id` - Delete category (admin)

### Orders
- `GET /api/v1/orders` - Get all orders
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id` - Update order status (admin)
- `DELETE /api/v1/orders/:id` - Delete order (admin)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## File Upload

The API supports file uploads for product images. Files are stored in the `public/uploads` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


# E-commerce
