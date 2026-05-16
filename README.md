# Team Task Manager

A full-stack web application for project and task management with role-based access control.

## 🔗 Live URL (When deployed)
https://your-app.railway.app

## 📦 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MongoDB Atlas (Cloud)
- **Deployment:** Railway

## ✨ Features
- ✅ User Authentication with JWT (Signup/Login)
- ✅ Role-based access: Admin and Member roles
- ✅ Project Management - Create, view, and manage projects
- ✅ Task Management - Create tasks with status, priority, and due dates
- ✅ Dashboard - View task summary and overdue alerts
- ✅ Admin Panel - Manage users and roles

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier available)

### Backend Setup
```bash
cd backend
npm install
# Create .env file and add your MongoDB URI
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📋 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/signup` | No | — | Register new user |
| POST | `/api/auth/login` | No | — | Login and get JWT |
| GET | `/api/auth/me` | Yes | Any | Current user profile |
| GET | `/api/users` | Yes | Admin | List all users |
| PATCH | `/api/users/:id/role` | Yes | Admin | Change user role |
| GET | `/api/projects` | Yes | Any | List projects |
| POST | `/api/projects` | Yes | Any | Create project |
| GET | `/api/projects/:id` | Yes | Any | Project details |
| PATCH | `/api/projects/:id` | Yes | Admin | Update project |
| DELETE | `/api/projects/:id` | Yes | Admin | Delete project |
| GET | `/api/tasks` | Yes | Any | List tasks |
| POST | `/api/tasks` | Yes | Any | Create task |
| PATCH | `/api/tasks/:id` | Yes | Any | Update task |
| DELETE | `/api/tasks/:id` | Yes | Admin | Delete task |
| GET | `/api/tasks/dashboard` | Yes | Any | Dashboard summary |

## 🔐 Authentication

The first user to sign up is automatically assigned the **Admin** role. All subsequent users are **Members**.

- Login generates a JWT token (valid for 7 days)
- Token is stored in localStorage
- Attach token to every API request via `Authorization: Bearer <token>` header

## 🗄️ Database Models

### User
- name, email, password (hashed), role (admin/member)

### Project
- name, description, owner, members array

### Task
- title, description, status (todo/in_progress/done)
- priority (low/medium/high), due_date, project, assigned_to

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

This project is ready for Railway deployment as two services in the same repository:

### 1) Backend service
- Root directory: `backend`
- Build command: none
- Start command: `npm start`

Environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` set by Railway automatically
- `NODE_ENV=production`
- `CLIENT_URL` set to your frontend URL

### 2) Frontend service
- Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

Environment variables:
- `VITE_API_URL` set to your backend public URL, for example `https://your-backend.up.railway.app/api`

### Deployment steps
1. Push the repository to GitHub.
2. Create a new Railway project.
3. Add the backend service from the `backend` folder.
4. Add the frontend service from the `frontend` folder.
5. Set the environment variables above.
6. Deploy both services and verify the frontend can reach the backend API.

Notes:
- The backend CORS policy already allows local development ports and should be pointed at the production frontend URL through `CLIENT_URL`.
- The frontend production build now succeeds and outputs to `frontend/dist`.

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit PRs and issues!
