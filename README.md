# Property Search App

A full-stack property search app built for IDX Exchange. The application allows users to search and browse property listings from a MySQL database, apply filters and sorting options, view individual property details and open houses, save favorite properties, and perform natural-language property searches using an AI service.

## Screenshot

[screenshot]

## Features

- Property search
- Filtering
- Pagination
- Sorting
- Natural-language/AI search
- Property details
- Open houses
- Favorite

## Tech Stack

### Frontend

- React 19.2.7
- Vite 8.1.1
- React Router 8.3.0
- Vitest 4.1.10
- React Testing Library 16.3.2
- JavaScript

### Backend

- Node.js 22.22.1
- Express 5.2.1
- MySQL 8
- mysql2 3.22.5
- Docker 
- Jest 30.4.2
- Supertest 7.2.2

### External Services

- OpenRouter

## Getting Started

### Prerequisites

The following is required to run the project locally:

- Node.js 22.x
- npm
- Docker Desktop
- MySQL 8

### 1. Clone the repository

````bash
git clone https://github.com/rmoughar/property-search-app
cd property-search-app
````
### 2. Set up the database

The backend uses MySQL 8 running in Docker.

Create and start a MySQL 8 container and create a database named rets.

The database must contain the follwing tables:

- `rets_property` - property listing information
- `rets_openhouse` - open house information

The database must be populated with the property and open house data used by the application

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory.

```env
DB_HOST=localhost
DB_USER=<your-mysql-user>
DB_PASSWORD=<your-mysql-password>
DB_NAME=rets
OPENROUTER_API_KEY=<your-openrouter-api-key>
BACKEND_PORT=4000
```

`BACKEND_PORT` is optional and defaults to `4000`. If the default port is already in use, set it to another available port.

Do not commit the `.env` file or API keys to the repository

### 4. Install backend and frontend dependencies

From the project root: 

```bash
cd backend
npm install

cd ../frontend 
npm install

cd ..
npm install
```

### 5. Start the backend and frontend

From the project root:

```bash
npm run dev
```

This starts both the backend and frontend dev servers.

The backend runs on:

```text
http://localhost:4000
```

The frontend runs on the vite dev server.

## Architecture

The application is divided into a React frontend and an Express backend. The frontend is responsible for the user interface, navigation, filtering, pagination, and communicating with the API. The backend handles API requests, database queries, input validation, natural-language search, and photo validation.

### Project Structure

```text
property-search-app/
├── backend/
│   ├── config/          # Database connection configuration
│   ├── routes/          # API route handlers
│   ├── services/        # Photo validation services
│   ├── tests/           # Backend tests
│   └── utils/           # Shared validation utilities
├── frontend/
│   ├── src/
│   │   ├── api/         # API client functions
│   │   ├── components/  # Reusable React components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Application pages
│   │   └── utils/       # Frontend utilities and contexts
│   └── testing/         # Frontend tests and test configuration
└── package.json         # Root development scripts
```

### Frontend Structure

The frontend is built with React and Vite.

- **Pages** contain the main application views:
    - Listings page
    - Property detail page
    - Favorites page
    - Natural-language search page

- **Components** contain reusable UI elements such as property cards, filters, pagination, etc.

- **Hooks** contain reusable stateful logic, including pagination and favorites/local-storage functionality.

- **API client** contains functions used to communicate with the backend API.

- **Utils** contains shared frontend state and utilities, including the favorites context.

React Router is used for navigation between pages.

### Backend Structure

The backend uses Node.js and Express.

- **Routes** define the application's API endpoints.
- **Config** contains the MySQL connection pool.
- **Services** contain application logic that does not directly belong in route handlers, including propert photo validation and refreshing.
- **Utils** contains reusable backend utilities such as query parameter validation.
- **Tests** contains Jest and Supertest tests for the API routes.

The backend connects to a MySQL 8 database using `mysql2`.

### Data Flow

For a standard property seach, the general request flow is: 

```
User
  ↓
React Page / Component
  ↓
frontend/src/api/client.js
  ↓
Express API
  ↓
Route Handler
  ↓
MySQL Database
  ↓
JSON Response
  ↓
React UI
```

For natural-language search:

```
User's natural-language query
  ↓
React Natural Search Page
  ↓
POST /api/search/natural
  ↓
OpenRouter
  ↓
AI-generated filter values
  ↓
Backend validation
  ↓
Filter values returned to frontend
  ↓
GET /api/properties
  ↓
MySQL Database
  ↓
Property results
```

When the backend starts, it also triggers the photo-validation refresh service to process property photos.

## API Reference

### GET /api/health

Checks whether the backend can successfully connect to and query the MySQL database.

**Example Request**
```text
GET /api/health
```

**Example Response**
```json
{
    "status": "ok",
    "database": "connected"
}
```

**Status Codes**
- 200 — Backend and database are available
- 500 — Database connection/query failed

### GET /api/properties

Retrieves property listings with optional filtering, sorting, and pagination..

**Query Parameters**

| Parameter  | Type   | Required | Description                                                                                                                                    |
| ---------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `city`     | string | No       | Filters properties by city. Matching is case-insensitive and ignores leading/trailing whitespace.                                              |
| `zipcode`  | number | No       | Filters properties by ZIP code.                                                                                                                |
| `minPrice` | number | No       | Returns properties at or above the specified price.                                                                                            |
| `maxPrice` | number | No       | Returns properties at or below the specified price.                                                                                            |
| `beds`     | number | No       | Filters by number of bedrooms. A value of `5` returns properties with 5 or more bedrooms.                                                      |
| `baths`    | number | No       | Filters by number of bathrooms. A value of `5` returns properties with 5 or more bathrooms.                                                    |
| `limit`    | number | No       | Number of properties to return. Defaults to `20` and must be greater than `0`.                                                                 |
| `offset`   | number | No       | Number of properties to skip. Defaults to `0`.                                                                                                 |
| `sort`     | string | No       | Sorts results using the format `field:direction`. Supported fields are `date`, `price`, `beds`, and `sqft`. Direction must be `ASC` or `DESC`. |

**Supported Sort Fields**

| Field   | Sorts By              |
| ------- | --------------------- |
| `date`  | Listing contract date |
| `price` | Property price        |
| `beds`  | Number of bedrooms    |
| `sqft`  | Square footage        |

**Example Request**

GET `/api/properties?city=Other&minPrice=250000&maxPrice=350000&beds=3&baths=2&limit=20&offset=0`

**Example Response**

```json
{
  "total": 1,
  "limit": 20,
  "offset": 0,
  "results": [
    {
      "L_ListingID": 12345,
      "L_SystemPrice": 300000,
      "L_Keyword2": 3,
      "LM_Dec_3": 2,
      "LM_Int2_3": 1500,
      "L_Address": "1234 Rivercrest Drive",
      "L_City": "Other",
      "L_State": "CA",
      "L_Zip": 97303
    }
  ]
}
```

The `results` array contains the property records returned by the database. The response may contain additional database fields not shown in this example.

**Status Codes**

- `200` — Request succeeded
- `400` — One or more query parameters are invalid
- `500` — Server or database error

### GET /api/properties/:id

Retrieves a single property using its listing ID.

**Path Parameters**

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| `id`      | number | Yes      | The listing ID of the property to retrieve. |

**Example Request**

GET `/api/properties/12345`

**Example Response**

```json
{
  "Property": {
    "L_ListingID": 12345,
    "L_SystemPrice": 300000,
    "L_Keyword2": 3,
    "LM_Dec_3": 2,
    "LM_Int2_3": 1500,
    "L_Address": "1234 Rivercrest Drive",
    "L_City": "Other",
    "L_State": "CA",
    "L_Zip": 97303
  }
}
```

The `Property` object contains the property record returned by the database and may contain additional database fields not shown in this example.

**Status Codes**

- `200` — Property found and returned successfully
- `400` — Invalid property ID
- `404` — No property exists with the specified ID
- `500` — Server or database error

### GET /api/properties/:id/openhouses

Retrieves the open houses associated with a specific property.

**Path Parameters**

| Parameter | Type   | Required | Description                     |
| --------- | ------ | -------- | ------------------------------- |
| `id`      | number | Yes      | The listing ID of the property. |

**Example Request**

GET `/api/properties/12345/openhouses`

**Example Response**

```json
{
  "Openhouses": [
    {
      "L_ListingID": 12345,
      "OpenHouseDate": "2026-08-15",
      "OH_StartTime": "13:00:00"
    }
  ]
}
```

The `Openhouses` array contains the open house records associated with the property. The results are ordered by open house date and start time.

**Status Codes**

- `200` — Request succeeded and open house records were returned
- `400` — Invalid property ID
- `404` — No property exists with the specified ID
- `500` — Server or database error


### GET /api/properties/ids/:ids

Retrieves multiple properties using a comma-separated list of listing IDs. Optional filtering and sorting can also be applied to the results.

**Path Parameters**

| Parameter | Type                    | Required | Description                                |
| --------- | ----------------------- | -------- | ------------------------------------------ |
| `ids`     | comma-separated numbers | Yes      | Listing IDs of the properties to retrieve. |

**Query Parameters**

The endpoint supports the same filtering and sorting parameters as `GET /api/properties`:

- `city`
- `zipcode`
- `minPrice`
- `maxPrice`
- `beds`
- `baths`
- `limit`
- `offset`
- `sort`

See [`GET /api/properties`](#get-apiproperties) for descriptions of these parameters.

**Example Request**

GET `/api/properties/ids/12345,12346,12347`

**Example Request with Filters and Sorting**

GET `/api/properties/ids/12345,12346,12347?minPrice=250000&beds=3&sort=price:DESC`

**Example Response**

```json
{
  "total": 3,
  "limit": 20,
  "offset": 0,
  "Properties": [
    {
      "L_ListingID": 12345,
      "L_SystemPrice": 300000,
      "L_Keyword2": 3,
      "LM_Dec_3": 2,
      "LM_Int2_3": 1500,
      "L_Address": "1234 Rivercrest Drive",
      "L_City": "Other",
      "L_State": "CA",
      "L_Zip": 97303
    }
  ]
}
```

The `Properties` array contains the matching property records. The response may contain additional database fields not shown in this example.

**Status Codes**

- `200` — Request succeeded and matching properties were returned
- `400` — One or more listing IDs or query parameters are invalid
- `404` — No properties matched the provided IDs and filters
- `500` — Server or database error

### POST /api/search/natural

Converts a natural-language property search query into structured property filters using an AI model through OpenRouter.

The endpoint sends the user's query to the configured AI model, which extracts any unambiguous property search criteria. The returned filters are then validated before being sent back to the frontend.

**Request Body**

| Field   | Type   | Required | Description                                           |
| ------- | ------ | -------- | ----------------------------------------------------- |
| `query` | string | Yes      | Natural-language description of the desired property. |

**Example Request**

```json
{
  "query": "3 bedroom house in LA under $400,000"
}
```

**Example Response**

```json
{
  "filters": {
    "city": "Los Angeles",
    "zipcode": "",
    "minPrice": "",
    "maxPrice": 400000,
    "beds": 3,
    "baths": "",
    "limit": "20",
    "offset": "0"
  }
}
```

The AI only extracts information that can be unambiguously determined from the query. Unspecified filters are returned as empty strings.

The response is validated before being returned. Price values must be positive numbers, while bedroom and bathroom values must be positive integers. Invalid or malformed AI output is replaced with the default empty filter set.

**Status Codes**

- `200` — Natural-language query processed successfully
- `500` — AI service or server error


## Database Schema

The application uses a MySQL 8 database containing property listing and open-house information.

### Tables

#### `rets_property`

Stores property listing information used throughout the application.

| Column              | Description                                   |
| ------------------- | --------------------------------------------- |
| `id`                | Auto-incrementing primary key                 |
| `L_ListingID`       | Property/listing system ID                    |
| `L_DisplayId`       | MLS listing number                            |
| `L_Address`         | Property address                              |
| `L_City`            | City                                          |
| `L_State`           | State                                         |
| `L_Zip`             | ZIP code                                      |
| `L_Keyword2`        | Number of bedrooms                            |
| `LM_Dec_3`          | Number of bathrooms                           |
| `L_SystemPrice`     | Listing price                                 |
| `LM_Int2_3`         | Approximate finished square footage           |
| `LMD_MP_Latitude`   | Geographic latitude                           |
| `LMD_MP_Longitude`  | Geographic longitude                          |
| `L_Photos`          | Original property photo data                  |
| `ValidatedPhotos`   | Validated property photo data                 |
| `PhotosValidatedAt` | Timestamp of the most recent photo validation |

The table contains additional MLS/property metadata including listing status, property type, agent information, remarks, lot information, amenities, features, and timestamps.

The primary key is `id`. Additional indexes are used for common property searches, including listing ID, city, ZIP code, price, bedrooms, bathrooms, and combinations of these fields. Functional indexes are also used for normalized city searches, and a full-text index is defined on `L_Remarks`.

#### `rets_openhouse`

Stores open-house information associated with property listings. A property may have zero, one, or multiple open-house records.

| Column          | Description                    |
| --------------- | ------------------------------ |
| `id`            | Auto-incrementing primary key  |
| `L_ListingID`   | Associated property/listing ID |
| `L_DisplayId`   | MLS listing number             |
| `OpenHouseDate` | Open-house date                |
| `OH_StartTime`  | Open-house start time          |
| `OH_EndTime`    | Open-house end time            |
| `OH_StartDate`  | Open-house start date          |
| `OH_EndDate`    | Open-house end date            |
| `all_data`      | Additional open-house API data |
| `updated_date`  | Last modification timestamp    |

`OpenHouseRemarks` is stored inside the JSON data in `all_data` rather than as a separate column. The application parses this field when displaying open-house information and treats missing or invalid remarks as empty.

Indexes are defined on listing ID, MLS listing number, open-house date, and a combination of listing/date/time fields.

### Relationships

`rets_openhouse.L_ListingID` is used to associate open houses with properties in `rets_property`.

A property can have **zero**, **one**, or **multiple open-house records**. When requesting open houses for a property, the application retrieves all matching records and orders them by open-house date and start time.

The application uses this relationship when retrieving open houses for a specific property through:

```text
GET /api/properties/:id/openhouses
```

The database does not currently define a foreign-key constraint between these tables; the relationship is enforced by the application when querying the data.

### Indexing

The `rets_property` table includes indexes for frequently used filters and searches, including:

- City
- ZIP code
- Price
- Bedrooms
- Bathrooms
- Bedroom/bathroom combinations
- City and ZIP
- City and price
- City, bedrooms, and bathrooms
- Full-text search on property remarks

These indexes are intended to improve query performance for the application's property filtering and search operations. MySQL supports functional indexes for expressions such as normalized city values, which is used by several of the city-related indexes in this schema.


## Testing

The project includes automated tests for both the frontend and backend.

### Backend

Backend tests use **Jest** and **Supertest** to test the Express API endpoints without requiring the server to be manually started.

The backend tests cover:

- Property retrieval and pagination
- Property filtering by city, ZIP code, price, bedrooms, and bathrooms
- Support for 5+ bedroom and bathroom filters
- Sorting properties by supported fields
- Validation of invalid query parameters
- Property lookup by listing ID
- Handling of unknown and invalid property IDs
- Open-house retrieval
- Handling of properties with no open houses
- Validation of open-house property IDs
- Error responses for invalid requests

Database queries are mocked during testing so that the API behavior can be tested without depending on the contents of the local database.

Run the backend tests from the `backend` directory with:

```bash
npm test
```

Coverage can be generated with:

```bash
npm test -- --coverage
```

### Frontend

Frontend tests use **Vitest** and **React Testing Library**.

The frontend tests cover:

- Property cards
- Property filtering
- Pagination
- Property API client functions
- Favorite interactions
- Invalid API responses and error handling
- Rendering and user interactions

Run the frontend tests from the `frontend` directory with:

```bash
npm test
```

Coverage can be generated with:

```bash
npm test -- --coverage
```

Vitest uses the V8 coverage provider for collecting frontend coverage.

### Coverage

Coverage was used to identify untested branches and prioritize additional tests during development.

The final coverage is approximately:

| Area     | Statements | Branches | Functions | Lines |
| -------- | ---------: | -------: | --------: | ----: |
| Frontend |       ~97% |     ~84% |      ~98% |  ~98% |
| Backend  |       ~61% |     ~60% |      ~50% |  ~60% |

The frontend has high coverage across the application's components and utility code. The remaining uncovered frontend code primarily consists of minor UI branches and error-handling paths.

Backend coverage is lower because the project contains additional code that is not currently exercised by the automated tests, particularly the natural-language search integration and some server/database error paths.

Jest supports collecting coverage with the `--coverage` flag, including coverage for untested project files.


## Known Issues

- The `/api/properties/ids/:ids` endpoint currently reports `total` based on the number of requested IDs rather than the number of properties returned.
- The property database is not included in the repository, so running the application with a populated dataset requires obtaining and configuring the appropriate database separately.
- The backend port and frontend development origin may need to be adjusted through environment/configuration settings depending on the local development environment.
- Pagination component on smaller screens can overflow scren

## Future Improvements

- Correct the `total` value returned by `/api/properties/ids/:ids` to reflect the number of properties actually returned.
- Expand backend test coverage, particularly for the natural-language search endpoint and additional database error paths.
- Provide a more convenient database setup process or a sanitized sample dataset so the application can be run without separately obtaining the full property dataset.
- Move frontend API/CORS configuration into environment variables to make local development and deployment easier to configure.
- Add production deployment configuration for the frontend, backend, database, and external API integration.
- Preserve the user's previous page and search state when navigating to property details so returning from a property restores the page they came from, such as natural-language search results, favorites, or filtered listings.
- Add a clear all favorites button on the favorites page.
- Refactor styling to improve mobile user experience

