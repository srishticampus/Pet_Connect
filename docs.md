# Development Design Document for PetConnect Server APIs

## 1. Authentication APIs

### 1.1 Register User
- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  - `email` (string): User email.
  - `password` (string): User password.
  - `role` (string): User role (adopter, foster, rescue, pet_owner, admin).
  - Additional fields based on role (e.g., name, contact details, organization details for rescues).
- **Response**:
  - `201 Created` on success with user details (excluding password).
  - `400 Bad Request` if required fields are missing or invalid.
  - `409 Conflict` if email already exists.

### 1.2 Login User
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email` (string): User email.
  - `password` (string): User password.
- **Response**:
  - `200 OK` on success with a JWT token.
  - `401 Unauthorized` if credentials are invalid.

### 1.3 Forgot Password
- **Endpoint**: `/auth/forgot-password`
- **Method**: `POST`
- **Request Body**:
  - `email` (string): User email.
- **Response**:
  - `200 OK` on success with a password reset token sent to the user email.
  - `404 Not Found` if email not found.

### 1.4 Reset Password
- **Endpoint**: `/auth/reset-password`
- **Method**: `POST`
- **Request Body**:
  - `token` (string): Password reset token.
  - `newPassword` (string): New password.
- **Response**:
  - `200 OK` on success.
  - `400 Bad Request` if token is invalid or expired.

## 2. User Profile APIs

### 2.1 Get User Profile
- **Endpoint**: `/profile`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK` on success with user profile details.
  - `401 Unauthorized` if token is invalid.

### 2.2 Update User Profile
- **Endpoint**: `/profile`
- **Method**: `PUT`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - Fields to update (e.g., name, contact details, organization details).
- **Response**:
  - `200 OK` on success with updated user profile details.
  - `401 Unauthorized` if token is invalid.

## 3. Pet APIs

### 3.1 List Pets
- **Endpoint**: `/pets`
- **Method**: `GET`
- **Query Parameters**:
  - `species` (string): Pet species (e.g., dog, cat).
  - `breed` (string): Pet breed.
  - `age` (number): Pet age.
  - `size` (string): Pet size (small, medium, large).
  - `location` (string): Pet location.
- **Response**:
  - `200 OK` on success with a list of pets matching the query parameters.

### 3.2 View Pet Details
- **Endpoint**: `/pets/:petId`
- **Method**: `GET`
- **Response**:
  - `200 OK` on success with detailed pet information including images and medical history.
  - `404 Not Found` if petId is not found.

### 3.3 Submit Adoption Application
- **Endpoint**: `/pets/:petId/adopt`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `message` (string): Optional message for the rescue/shelter.
- **Response**:
  - `201 Created` on success with application details.
  - `401 Unauthorized` if token is invalid.
  - `404 Not Found` if petId is not found.

### 3.4 Submit Foster Application
- **Endpoint**: `/pets/:petId/foster`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `message` (string): Optional message for the rescue/shelter.
- **Response**:
  - `201 Created` on success with application details.
  - `401 Unauthorized` if token is invalid.
  - `404 Not Found` if petId is not found.

### 3.5 Manage Foster Pets
- **Endpoint**: `/fosters`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK` on success with a list of pets currently being fostered by the user.
  - `401 Unauthorized` if token is invalid.

### 3.6 Communicate with Rescues/Shelters
- **Endpoint**: `/messages`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `recipientId` (string): ID of the rescue/shelter.
  - `message` (string): Message content.
- **Response**:
  - `201 Created` on success with message details.
  - `401 Unauthorized` if token is invalid.
  - `404 Not Found` if recipientId is not found.

## 4. Rescue/Shelter APIs

### 4.1 Create and Manage Organization Profile
- **Endpoint**: `/organizations`
- **Method**: `POST` (for creation) or `PUT` (for update)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `name` (string): Organization name.
  - `address` (string): Organization address.
  - `contact` (string): Organization contact details.
- **Response**:
  - `201 Created` on success with organization details.
  - `401 Unauthorized` if token is invalid.

### 4.2 List Available Pets for Adoption or Fostering
- **Endpoint**: `/organizations/:organizationId/pets`
- **Method**: `GET`
- **Response**:
  - `200 OK` on success with a list of pets available for adoption or fostering.
  - `404 Not Found` if organizationId is not found.

### 4.3 Manage and Review Adoption and Foster Applications
- **Endpoint**: `/organizations/:organizationId/applications`
- **Method**: `GET`
- **Response**:
  - `200 OK` on success with a list of adoption and foster applications submitted to the organization.
  - `404 Not Found` if organizationId is not found.

### 4.4 Communicate with Adopters and Fosters
- **Endpoint**: `/messages`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `recipientId` (string): ID of the adopter or foster.
  - `message` (string): Message content.
- **Response**:
  - `201 Created` on success with message details.
  - `401 Unauthorized` if token is invalid.
  - `404 Not Found` if recipientId is not found.

## 5. Pet Owner APIs

### 5.1 Report Lost Pet
- **Endpoint**: `/lost-pets`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `petName` (string): Name of the lost pet.
  - `description` (string): Description of the lost pet.
  - `lastSeenLocation` (string): Last seen location of the lost pet.
  - `image` (string): URL of the lost pet's image.
- **Response**:
  - `201 Created` on success with lost pet report details.
  - `401 Unauthorized` if token is invalid.

### 5.2 Report Found Pet
- **Endpoint**: `/found-pets`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `petDescription` (string): Description of the found pet.
  - `foundLocation` (string): Location where the pet was found.
  - `image` (string): URL of the found pet's image.
- **Response**:
  - `201 Created` on success with found pet report details.
  - `401 Unauthorized` if token is invalid.

### 5.3 Communicate with Rescue Teams
- **Endpoint**: `/messages`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `recipientId` (string): ID of the rescue team.
  - `message` (string): Message content.
- **Response**:
  - `201 Created` on success with message details.
  - `401 Unauthorized` if token is invalid.
  - `404 Not Found` if recipientId is not found.

## 6. Admin APIs

### 6.1 Verify Rescues and Shelters
- **Endpoint**: `/admin/organizations/verify`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Request Body**:
  - `organizationId` (string): ID of the organization to verify.
- **Response**:
  - `200 OK` on success with verified organization details.
  - `401 Unauthorized` if token is invalid or user is not an admin.
  - `404 Not Found` if organizationId is not found.

### 6.2 Manage Users
- **Endpoint**: `/admin/users`
- **Method**: `GET` (list users) or `DELETE` (delete user)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters (for GET)**:
  - `role` (string): Filter users by role (optional).
- **Response**:
  - `200 OK` on success with a list of users or a confirmation of deletion.
  - `401 Unauthorized` if token is invalid or user is not an admin.

### 6.3 Moderate Pet Listings
- **Endpoint**: `/admin/pets`
- **Method**: `GET` (list pet listings) or `DELETE` (delete inappropriate listings)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK` on success with a list of pet listings or a confirmation of deletion.
  - `401 Unauthorized` if token is invalid or user is not an admin.

### 6.4 Monitor Platform Activity
- **Endpoint**: `/admin/activity`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - `200 OK` on success with platform activity statistics (adoption rates, user engagement).
  - `401 Unauthorized` if token is invalid or user is not an admin.

## 7. AI/ML APIs

### 7.1 AI-Powered Breed Detection
- **Endpoint**: `/ai/breed-detect`
- **Method**: `POST`
- **Request Body**:
  - `image` (string): Base64 encoded image of the pet.
- **Response**:
  - `200 OK` on success with detected breed information.
  - `400 Bad Request` if image is invalid.

## 8. Service Directory APIs
### 8.1 List Pet Services
- **Endpoint**: `/services`
- **Method**: `GET`
- **Response**:
  - `200 OK` with list of registered pet services (veterinarians, groomers, trainers) including name, contact, and location.

### 8.2 Register Service Provider
- **Endpoint**: `/services/register`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>` (Admin only)
- **Request Body**:
  - `name` (string): Service provider name
  - `type` (string): Service type (vet, groomer, trainer)
  - `contact` (string): Contact information
  - `location` (string): Service location
- **Response**:
  - `201 Created` on success with service details
  - `401 Unauthorized` if token invalid or not admin

## API to System Feature Mapping
| **System Feature**               | **Relevant APIs**                                                                 |
|---------------------------------|-----------------------------------------------------------------------------------|
| All-in-One Adoption Platform    | Pet Listing (3.1), Adoption Application (3.3), Foster Application (3.4)       |
| Automated Processes             | Adoption/Foster Applications (3.3, 3.4), AI Breed Detection (7.1)            |
| Verified Organizations          | Organization Verification (6.1), Rescue/Shelter Profile Management (4.1)     |
| Lost & Found System             | Report Lost/Found Pets (5.1, 5.2), Communication with Rescue Teams (5.3)      |
| Service Directory               | Service Listing (8.1), Service Registration (8.2)                              |
| Centralized Communication       | Messaging System (3.6, 4.4, 5.3)                                              |

## Benefits Documentation
1. **Reduces Manual Effort**:
   - Automated adoption/foster applications (3.3, 3.4) replace paper-based processes
   - AI-driven breed detection (7.1) eliminates manual identification

2. **Enhances Trust**:
   - Organization verification (6.1) ensures legitimate shelters/rescues
