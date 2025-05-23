# URL_shortener

A robust and scalable URL shortening service similar to Bit.ly, built with Node.js and MongoDB.

## Features

- Shortens long URLs into manageable short links
- Custom alias support for personalized short URLs
- Click tracking and analytics
- URL expiration handling
- Duplicate URL detection (same long URL always generates the same short code)
- Validation for invalid URLs
- Error handling for duplicate aliases
- Scalable architecture for high traffic

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Utilities**: nanoid (from Node.js) for unique code generation, valid-url(from Node.js) for URL validation

## System Architecture

The system follows a RESTful API design with the following components:

1. **API Layer**: Express.js handles HTTP requests and routing
2. **Controller Layer**: Business logic for URL shortening and redirection
3. **Data Layer**: MongoDB for permanent storage of URL mappings
4. **Utility Layer**: Helper functions for short code generation (nanoid) and validation(valid-url)

## Database Schema

```javascript
{
  urlCode: String,     // Unique identifier for short URL
  longUrl: String,     // Original long URL
  shortUrl: String,    // Full short URL
  clicks: Number,      // Click tracking
  createdAt: Date,     // Creation time
  expiresAt: Date      // Expiration time
}
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (v4+)

### Installation

1. Clone the repository
```bash
git clone https://github.com/brindafadadu/URL_shortener
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:5000
```

5. Start the server with auto-reload:
```bash
npm run dev
```

## API Endpoints

### 1. Shorten a URL

**Endpoint**: `POST /api/url/shorten`

**Request Body**:
```json
{
  "longUrl": "https://example.com/very/long/url/that/needs/shortening"
}
```

**`Query Parameter**:
- `alias`: Custom short code (e.g., `?alias=somecustomname`)

**Response** (201 Created):
```json
{
  "_id": "60f7b0b9e6c1f32b4c4b4d7a",
  "longUrl": "https://example.com/very/long/url/that/needs/shortening",
  "shortUrl": "http://localhost:5000/abc123",
  "urlCode": "abc123",
  "clicks": 0,
  "createdAt": "2025-03-21T12:30:33.123Z",
  "expiresAt": "2026-03-21T12:30:33.123Z"
}
```

### 2. Redirect to Original URL

**Endpoint**: `GET /:code`

**Example**: `GET /abc123`

**Response**: 302 Redirect to the original URL

### 3. Get URL Statistics

**Endpoint**: `GET /api/url/:urlcode/stats`

**Example**: `GET /api/url/abc123/stats`

**Response** (200 OK):
```json
{
  "urlCode": "abc123",
  "longUrl": "https://example.com/very/long/url/that/needs/shortening",
  "shortUrl": "http://localhost:5000/abc123",
  "clicks": 2,
  "createdAt": "2025-03-21T12:30:33.123Z",
  "expiresAt": "2026-03-21T12:30:33.123Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid URL provided
- `404 Not Found`: Short URL code not found
- `409 Conflict`: Custom alias already in use
- `410 Gone`: URL has expired
- `500 Internal Server Error`: Server-side error

## Scalability Considerations

This URL shortener is designed with scalability in mind:

1. **Database Indexing**: Optimized queries with indexes on frequently accessed fields
2. **Short Code Generation**: Uses nanoid for efficient unique ID generation
3. **Horizontal Scaling**: Stateless design allows for easy deployment across multiple servers

## Testing

All the deployment endpoints were tested locally using Postman

## License

MIT