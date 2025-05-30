# Pet Connect Developer Documentation

## Overview
Pet Connect is a comprehensive platform connecting pet adopters, fosters, rescues/shelters, and pet owners. This documentation outlines the system's functional requirements based on the provided WBS, organized by user roles and modules.

## System Modules

### 1. Landing Page
**Header Section:**
- Website Name with Logo
- Navigation:
  - Home (Link)
  - About Us (Link)
  - Contact Us (Link)
  - Login (Dropdown with role selection):
    - Admin (Text Link)
    - Adopters (Text Link)
    - Fosters (Text Link)
    - Rescues/Shelters (Text Link)
    - PetOwners (Text Link)

**Features Section:**
- (To be defined based on marketing requirements)

**Footer Section:**
- Privacy Policy (Link)
- Terms and Conditions (Link)
- Contact Us (Link)

### 2. Admin Module

#### Login
- Username (Textbox)
- Password (Textbox with eye icon toggle)
- Login (Button)

#### Dashboard
- **Adopters Report**:
  - Total Adopters Requests count (Pie Chart)
  - Total approved Adopters count (View)
  
- **Rescues/Shelters Report**:
  - Total Rescues/Shelters Request count (Pie Chart)
  - Total approved Rescues/Shelters count (View)
  
- **Fosters Reports**:
  - Total Fosters Request count (Pie Chart)
  - Total approved Fosters count (View)
  
- **Pets**:
  - Adopted Pets (Pie Chart)
  - Fostered Pets (View)
  - Total Pets (View)
  
- **Total Lost Pets**:
  - Total Lost Pet Count (View)
  
- **Total Found Pets**:
  - Total Found Pet Count (View)

**Side Tabs Navigation:**
- Adopter Management
- Foster Management
- Rescue Management
- Pet Owner
- View Lost/Found Pets
- Adoption/Foster Application Management
- View Adopted Pets
- View Fostered Pets
- Manage Document
- Logout

#### Adopter Management
- **Adopters Requests**:
  - Name (View)
  - Aadhar Card Number (View)
  - Aadhar Card Image (Image link)
  - Email (View)
  - Phone number (View)
  - Photo (Image)
  - Place (View)
  - Approve/Reject (Toggle button)

- **Approved Adopters**:
  - Same fields as above
  - Activate/Deactivate (Toggle button)

#### Foster Management
- **Foster Request**:
  - Name (View)
  - Email (View)
  - Phone number (View)
  - Photo (View)
  - Place (View)
  - Aadhar Card Number (View)
  - Aadhar Card Image (View)
  - Approve/Reject (Toggle button)

- **Approved Foster**:
  - Same fields as above
  - Active/Inactive (Toggle button)

#### Rescue Management
- **Rescue/Shelters Requests**:
  - Name (View)
  - Email (View)
  - Phone number (View)
  - Place (View)
  - Certificate (View)
  - Approve/Reject (Toggle button)

- **View Approved Rescues/Shelters**:
  - Same fields as above
  - Active/Inactive (Toggle button)
  - View Available Pets (Link)

#### Pet Owner Management
- **View Pet Owners**:
  - Name (View)
  - Email (View)
  - Phone number (View)
  - Place (View)
  - Aadhar Card Number (View)
  - Aadhar Card Image (Image)
  - View Pet Details (Link)

#### View Lost/Found Pets
- **Lost Pets**:
  - Photo (Photo)
  - Breed (View)
  - Species (Dropdown list)
  - View More (Button)
  
  **View More**:
  - Additional details including health status (dynamic by species)
  - Location, date, reported by info

- **Found Pets**:
  - Similar structure as Lost Pets with additional found date field

#### Adoption/Foster Application View
- Detailed views for both adoption and foster applications with:
  - User information
  - Pet information
  - Request dates
  - Approval/rejection functionality
  - Rejection reason field (conditionally enabled)

#### Manage Documents
- Forms management for adoption and foster processes:
  - Title (Textbox/View)
  - Description (Textarea/View)
  - CRUD operations (Add/Edit/Update buttons)

### 3. Foster Module

#### Registration
- Name (Textbox)
- Email (Textbox)
- Phone number (Textbox)
- Aadhar Card number (Textbox)
- Aadhar Card Image (Image Upload)
- Photo (Image Upload)
- Password (Textbox with eye icon)
- Confirm Password (Textbox with eye icon)
- Register (Button)
- Login link

#### Login/Password Reset
- Standard authentication flows with email verification

#### Profile Management
- View and edit profile information
- Photo and document management

#### Fostering Functionality
- **View Pets and Apply**:
  - Species filter (Dropdown)
  - Pet cards with:
    - Photo (Photo)
    - Breed (View)
    - Species (View)
    - Age (View)
    - View More (Button)
  - Application form with:
    - Policy approval (Checkbox)
    - View Policy (Link)
    - Date selection
    - Apply button

- **View Assigned Pets**:
  - List view with details
  - Rescue/Shelter information

- **Track Applications**:
  - Status tracking
  - Rejection reason display

#### Rescue Communication
- View Rescues/Shelters (Dropdown list)
- Chat functionality:
  - Message input (Textbox)
  - Send (Button)

### 4. Adopter Module

#### Registration
- Similar to Foster with additional location field

#### Adoption Process
- **View Pets**:
  - Card view with basic info
  - Detailed view with:
    - Health status (dynamic by species)
    - Location
    - Adoption request button

- **Track Applications**:
  - Status and rejection reasons

#### Rescue Communication
- Similar chat functionality as Foster module

### 5. Rescue/Shelter Module

#### Pet Management
- **Add/Edit Pets**:
  - Photo (Picture Upload)
  - Species (Textbox)
  - Breed (View)
  - Size (Textbox)
  - Age (Date)
  - Health Status (Dynamic checkbox by species)
  - Location (Textbox)

- **View/Manage Pets**:
  - List with edit/remove options

#### Application Management
- **Adoption Applications**:
  - Approve/Reject functionality
  - Rejection reason field

- **Foster Applications**:
  - Similar to adoption with date ranges

#### Lost/Found Pets
- View and manage reports
- Chat with reporters

### 7. Pet Owner Module

#### Pet Management
- **Add/Edit Pets**:
  - Photo (with breed identification)
  - Species, breed, size, age
  - Health status (dynamic by species)
  - Location

#### Lost/Found Reporting
- **Report**:
  - Type (Lost/Found dropdown)
  - Detailed pet information
  - Date, location, issue description

- **View/Edit Reports**:
  - Status updates (especially for found pets)
  - Found date recording

#### Rescue Communication
- View Rescues/Shelters
- Chat functionality

## Health Status Dynamic System
The system includes a dynamic health status feature that changes based on selected species:
- **Dogs**: Fleas & ticks, Ear Infections, Worms, Dental disease
- **Birds**: Feather plucking, Nutritional deficiencies
- (Other species to be defined)

## Common Functionality
All modules include:
- Profile management with photo/document uploads
- Authentication flows (login, registration, password reset)
- Responsive card-based UI for pet displays
- Conditional field enabling (e.g., rejection reasons only when rejecting)
- Date tracking for all significant events

## Technical Considerations
(Note: As requested, no specific technical implementations are included, but the documentation provides complete feature specifications for development)

This documentation comprehensively covers all features and fields from the WBS in an organized, role-based structure suitable for guiding development while remaining technology-agnostic.