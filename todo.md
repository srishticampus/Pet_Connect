# PetConnect Development To-Do List

## Introduction

PetConnect aims to provide a centralized platform for pet adoption, fostering, and rescue. The project will be developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) and will include AI/ML integration for pet breed identification.

### Step 1: Initial Setup

- [x] **Set up the project structure:**
    - [x] Create a new directory for the project.
    - [x] Initialize a Node.js project for the server and a React project for the client.
    - [x] Set up MongoDB as the database for the project.

- [x] **Initialize the database:**
    - [x] Define the schema for users (adopters, fosters, rescues, pet owners, and admins).
    - [x] Define the schema for pets (including fields for species, breed, age, size, location, and images).
    - [x] Define the schema for organizations (rescues and shelters).
    - [x] Define the schema for adoption and foster applications.
    - [x] Define the schema for lost and found pet reports.

### Step 2: Backend Development

#### Authentication APIs (Completed)
- [x] **/auth/register** (Basic)
  - [x] Implement endpoint with role-based registration
  - [x] Add input validation for required fields
  - [x] Implement password hashing (argon2)
  - [x] Add conflict checking for existing emails

- [x] **/auth/login** (Basic)
  - [x] Implement JWT token generation
  - [x] Add credential validation
  - [x] Set secure HTTP-only cookies (Refresh Token) & CSRF Token Cookie

- [x] **/auth/forgot-password**
  - [x] Implement email verification (User lookup)
  - [x] Generate secure reset tokens (Hashed, with expiry)
  - [x] Integrate email service provider (via `sendEmail` service)

- [x] **/auth/reset-password**
  - [x] Add token validation middleware (Logic within route handler)
  - [x] Implement password update logic
  - [x] Handle token expiration (Checked during lookup)

#### User Profile APIs (Completed)
- [x] **GET /profile**
- [x] **PUT /profile**

#### Pet APIs (Foundation Laid)
- [x] **GET /pets** (Basic)
  - [x] Implement basic query filtering
  - [ ] Add pagination support
  - [ ] Create geospatial search for location filtering

- [x] **GET /pets/:petId** (Basic)
  - [ ] Implement pet data aggregation
  - [ ] Add related pets suggestion logic
  - [ ] Handle media asset loading

#### Core Infrastructure Completed:
- MongoDB connection pooling
- Request logging system
- Basic error handling middleware
- Environment configuration
- CSRF Protection (via csurf or custom middleware - implemented custom logic)
- Refresh Token Strategy

### Next Priority Tasks
- [x] Implement application schema for adoption/foster system
- [x] Build geospatial search functionality
- [ ] Add pagination support to `/pets` API

(Rest of the file maintains original structure with remaining unchecked items)