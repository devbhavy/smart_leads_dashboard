# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Tech Stack

**Frontend:** React, TypeScript, TailwindCSS, Vite  
**Backend:** Node.js, Express, TypeScript  
**Database:** MongoDB, Mongoose  
**Auth:** JWT, bcrypt  
**Validation:** Zod  
**Containerization:** Docker, Docker Compose  

## Features

- JWT-based authentication (register, login, protected routes)
- Lead management (create, update, delete, view)
- Advanced filtering by status, source, and search
- Debounced search
- Pagination (10 records per page)
- Role-based access control (Admin / Sales)
- CSV export
- Fully dockerized setup

## Project Structure

project/
├── docker-compose.yml
├── server/          # Express + TypeScript backend
└── client/          # React + TypeScript frontend


## Getting Started

### Prerequisites
- Docker and Docker Compose installed

### Run with Docker

1. Clone the repository
```bash
   git clone <your-repo-url>
   cd <your-repo>
```

2. Set up environment variables
```bash
   cp server/.env.example server/.env
```
   Fill in the values in `server/.env`

3. Run everything
```bash
   docker-compose up --build
```

4. Open your browser
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Run Locally (without Docker)

**Backend:**
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

### server/.env

MONGO_URI=your_mongo_url
JWT_PASSWORD=your_jwt_password
PORT=3000


### client/.env
VITE_API_URL=http://localhost:3000/api


## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/user/signup | Register a new user |
| POST | /api/user/signin | Login |
| GET | /api/user/me | Get current user |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/lead | Get all leads (with filters) |
| GET | /api/lead/:id | Get single lead |
| POST | /api/lead | Create lead |
| PUT | /api/lead/:id | Update lead |
| DELETE | /api/lead/:id | Delete lead (admin only) |
| GET | /api/lead/export | Export leads as CSV |

### Query Parameters for GET /api/lead
| Param | Description |
|-------|-------------|
| search | Search by name or email |
| status | Filter by status (New/Contacted/Qualified/Lost) |
| source | Filter by source (Website/Instagram/Referral) |
| sort | Sort by latest or oldest |
| page | Page number (default: 1) |
| limit | Records per page (default: 10) |

## Roles

| Role | Permissions |
|------|-------------|
| Admin | View all leads, create, update, delete |
| Sales | View own leads, create, update |

## Default Behavior

- Every new user registered gets the `sales` role by default
- To create an admin, manually update the role in MongoDB or seed the database