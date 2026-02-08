# Final
Telgarin Diar IT-2409 Final Project "Movie Website"

# Movie Website
A simple movie collection management system built with Node.js, Express.js, and MongoDB. Users can register, login, and manage their personal movie collections.

## Features

- User authentication with JWT
- Password hashing with bcrypt
- Create, read, update, and delete movies
- User profile management
- External API integration for movie search
- Input validation with Joi
- Error handling middleware

## Setup and Installation

### Prerequisites

- Node.js 
- MongoDB Atlas account or local MongoDB installation
- OMDB API key 

### Installation Steps

1. Clone the repository or download the project files

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OMDB_API_KEY=your_omdb_api_key
```

4. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Routes

#### Register User
- **Method:** POST
- **Endpoint:** `/api/auth/register`
- **Access:** Public
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "jwt_token"
  }
}
```

#### Login User
- **Method:** POST
- **Endpoint:** `/api/auth/login`
- **Access:** Public
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "token": "jwt_token"
  }
}

#### Get User Profile
- **Method:** GET
- **Endpoint:** `/api/users/profile`
- **Access:** Private
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile
- **Method:** PUT
- **Endpoint:** `/api/users/profile`
- **Access:** Private
- **Body:**
```json
{
  "username": "new_username",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

### Movie Routes

#### Create Movie
- **Method:** POST
- **Endpoint:** `/api/movies`
- **Access:** Private
- **Body:**
```json
{
  "title": "Inception",
  "description": "A thief who steals corporate secrets through dream-sharing technology",
  "genre": "Sci-Fi",
  "releaseYear": 2010,
  "rating": 8.8,
  "director": "Christopher Nolan",
  "poster": "https://example.com/poster.jpg"
}
```

#### Get All User Movies
- **Method:** GET
- **Endpoint:** `/api/movies`
- **Access:** Private
- **Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "movie_id",
      "title": "Inception",
      "description": "Movie description",
      "genre": "Sci-Fi",
      "releaseYear": 2010,
      "rating": 8.8,
      "director": "Christopher Nolan",
      "poster": "poster_url",
      "user": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Movie
- **Method:** GET
- **Endpoint:** `/api/movies/:id`
- **Access:** Private

#### Update Movie
- **Method:** PUT
- **Endpoint:** `/api/movies/:id`
- **Access:** Private
- **Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "rating": 9.0
}
```

#### Delete Movie
- **Method:** DELETE
- **Endpoint:** `/api/movies/:id`
- **Access:** Private

#### Search Movie 
- **Method:** GET
- **Endpoint:** `/api/movies/search/:title`
- **Access:** Private
- **Example:** `/api/movies/search/Interstellar`
- **Response:**
```json
{
  "success": true,
  "data": {
    "title": "Interstellar",
    "year": "2014",
    "genre": "Adventure, Drama, Sci-Fi",
    "director": "Christopher Nolan",
    "plot": "Movie plot description",
    "poster": "poster_url",
    "rating": "8.7"
  }
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `OMDB_API_KEY` - API key for OMDB movie database 

## Database Models

### User Model
- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- createdAt (Date)

### Movie Model
- title (String, required)
- description (String, required)
- genre (String, required)
- releaseYear (Number, required)
- rating (Number, 0-10)
- director (String)
- poster (String)
- user (ObjectId, ref: User)
- createdAt (Date)

## External API Integration

This project integrates with the OMDB API to search for movie information. To use this feature:

1. Get a free API key from [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Add the API key to your `.env` file
3. Use the `/api/movies/search/:title` endpoint

## Deployment

1. Set all environment variables on Render
2. Ensure MongoDB connection string is accessible from the deployed server
3. Update CORS settings if needed for frontend integration

