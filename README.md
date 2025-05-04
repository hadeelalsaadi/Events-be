# Events-be
# Event Manager API

RESTful API backend for the Event Manager application with PostgreSQL database.

## 🚀 Live API

- Backend API:[ [Render Deployment](https://events-be-mnrt.onrender.com/api)

## 📋 Project Overview

The Event Manager API provides endpoints for managing events, users, and evet_attendees with event genre table. The API supports two user roles (admin and member) with different access permissions.

### Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Supabase)
- **Testing**: Supertest
- **Deployment**: Render

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/event-manager-api.git
cd event-manager-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and other config

# Run development server
npm run dev
```

## 📊 Database Schema

The PostgreSQL database includes the following tables:

- **users*
- **events**
- **event_attendees** 
- **genres** 

## 🔌 API Endpoints/ please click on render link for nice view 

{
"endpoints": {
"GET /api": {
"description": "serves up a json representation of all the available endpoints of the api"
},
"GEt /api/events": {
"description": "response with  events  title , imag, location and date for the event_card in ront-end"
},
"GET /api/events/:event_id": {
"description": " response with  an event's all details ",
"parameters": "exchange :event_id with anumber represents event_id"
},
"POSt /api/events": {
"description": "adds a new event to the list",
"parameters": " an object with properties of table columns considering NOT NULL values "
},
"PATCH /api/events/:event_id": {
"description": "response with ok when user update an event details",
"parameters": "send the new object with all new detailes"
},
"DELETE /api/events/:event_id": {
"description ": "delets event and responds with the correct status when given the delete query",
"parameters": "exchange :event_id with anumber represents event_id"
},
"POST /api/users": {
"description": "register a new user to the users database",
"parameters": "send an object with the new user's details"
},
"POST /api/event_attendees": {
"description": " sign up a user for an event",
"parameters": " send user_id and event_id as an object "
}
}
}

## 🔐 User Roles 

The application supports two user roles:

1. **Admin**
   - Can create, update, and delete events

2. **Member**
   - Can view events
   - Can join events
   - Cannot create or modify events

User roles are determined during signup, with no restrictions on which role a user can select. 


## 🧪 Testing

API endpoints are tested using Supertest:

```bash
# Run tests
npm test
```

Example test file structure:
```
__tests__/
   app.test.js
```

## 🚀 Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add the following environment variables:
   - `NODE_ENV=production`
   - `PORT=10000` (or your preferred port)
   - `DATABASE_URL=your_supabase_connection_string`
4. Set the build command: `npm install`
5. Set the start command: `npm start`
6. Deploy

## 🛠️ Future Improvements

- Implement JWT authentication
- Add request rate limiting
- Implement email notifications
- Add event searching and filtering
- Create event reporting functionality


