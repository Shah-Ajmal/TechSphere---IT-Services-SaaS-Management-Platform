# TechSphere - IT Services & SaaS Management Platform

A modern, full-stack web application for managing IT services and SaaS products with interactive dashboards, role-based access control, and comprehensive service management.


## 📸 Screenshots

> Add screenshots of your application here

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin & Client/User)
- Secure password hashing with bcrypt
- Protected routes on frontend and backend
- Auto-login after registration
- Persistent sessions with localStorage

### 👨‍💼 Admin Dashboard
- **Complete Business Overview**
  - Real-time metrics (clients, subscriptions, revenue, tickets)
  - Interactive revenue trend charts (Recharts)
  - Client growth bar charts
  - Recent activity feed
  - Recent tickets widget
  - Top services ranking
- **Full CRUD Operations**
  - Manage clients, services, subscriptions, and tickets
  - Add, edit, delete functionality
  - Search and filter capabilities
  - Bulk operations support

### 👤 Client/User Dashboard
- **Personal Overview**
  - Personal ticket statistics
  - Ticket timeline and status
  - Service recommendations
  - Quick actions for support
- **Limited Access**
  - View available services
  - Create and track own tickets
  - Update profile settings

### 💼 Service Management
- ✅ Add new services with full details
- ✅ Edit existing services
- ✅ Delete services with confirmation
- ✅ View detailed service information
- ✅ Search and filter services
- ✅ Category-based organization
- ✅ Active/Inactive status toggle
- ✅ Feature lists and pricing

### 👥 Client Management
- Client listing with comprehensive details
- Search functionality
- Subscription status tracking
- Contact information management
- Company details

### 🎫 Support Ticket System
- Create support tickets
- Priority levels (Low, Medium, High, Critical)
- Status tracking (Open, In Progress, Resolved, Closed)
- Category classification
- Admin ticket assignment
- Ticket notes and updates

### 📊 Analytics Dashboard
- Revenue metrics
- Client acquisition trends
- Service performance
- Ticket resolution analytics

### 🎨 UI/UX Features
- **Modern Design**
  - Dark/Light mode toggle
  - Smooth animations and transitions
  - Professional Shadcn UI components
  - Responsive design (mobile-first)
- **Interactive Elements**
  - Real-time data updates
  - Loading states
  - Error handling
  - Toast notifications
  - Confirmation dialogs

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Security:** CORS, Helmet
- **Environment:** dotenv

---

## 📁 Project Structure

```
its-saas-platform/
├── techSphere_frontend/          # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── layout/          # Layout components (Sidebar, Navbar)
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── clients/         # Client components
│   │   │   ├── services/        # Service components
│   │   │   └── common/          # Shared components
│   │   ├── pages/               # Page components
│   │   ├── redux/               # Redux store & slices
│   │   ├── services/            # API service functions
│   │   ├── lib/                 # Utilities & axios config
│   │   ├── config/              # API configuration
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── public/                  # Static assets
│   ├── .env                     # Environment variables
│   └── package.json
│
├── techSphere_backend/           # Node.js backend API
│   ├── src/
│   │   ├── config/              # Database configuration
│   │   ├── models/              # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Client.js
│   │   │   ├── Service.js
│   │   │   └── Ticket.js
│   │   ├── routes/              # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── client.routes.js
│   │   │   ├── service.routes.js
│   │   │   └── ticket.routes.js
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Auth & error middleware
│   │   ├── utils/               # Utilities & validators
│   │   └── server.js            # Entry point
│   ├── .env                     # Environment variables
│   └── package.json
│
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)
- **Git**

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd its-saas-platform
```

#### 2. Backend Setup

```bash
# Navigate to backend folder
cd techSphere_backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=24h
FRONTEND_URL=http://localhost:5173
```

**Seed the database (optional):**
```bash
npm run seed
```

**Start backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

#### 3. Frontend Setup

```bash
# Navigate to frontend folder (from root)
cd techSphere_frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Configure `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TechSphere
```

**Start frontend server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🧪 Testing

### Demo Credentials

After seeding the database, use these credentials:

**Admin Account:**
```
Email: admin@techsphere.com
Password: admin123
```

**User Account:**
```
Email: john@example.com
Password: password123
```

### Testing Features

1. **Authentication**
   - Register new account
   - Login with credentials
   - Logout functionality
   - Protected route access

2. **Admin Features**
   - View all clients, services, tickets
   - Create new services
   - Edit existing services
   - Delete services
   - Manage tickets
   - View analytics

3. **Client Features**
   - View available services
   - Create support tickets
   - Track own tickets
   - Update profile

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/profile` | Protected | Get user profile |

### Services Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/services` | Protected | Get all services |
| GET | `/services/:id` | Protected | Get single service |
| POST | `/services` | Admin | Create service |
| PUT | `/services/:id` | Admin | Update service |
| DELETE | `/services/:id` | Admin | Delete service |

### Clients Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/clients` | Protected | Get all clients |
| GET | `/clients/:id` | Protected | Get single client |
| POST | `/clients` | Admin | Create client |
| PUT | `/clients/:id` | Admin | Update client |
| DELETE | `/clients/:id` | Admin | Delete client |

### Tickets Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/tickets` | Protected | Get tickets (all for admin, own for users) |
| GET | `/tickets/:id` | Protected | Get single ticket |
| POST | `/tickets` | Protected | Create ticket |
| PUT | `/tickets/:id` | Admin | Update ticket status |
| POST | `/tickets/:id/notes` | Protected | Add note to ticket |
| DELETE | `/tickets/:id` | Admin | Delete ticket |

**Total API Endpoints:** 18

---

## 🎯 Features Roadmap

### ✅ Completed
- [x] User authentication (register, login, logout)
- [x] JWT-based authorization
- [x] Role-based access control
- [x] Admin dashboard with charts
- [x] Client/User dashboard
- [x] Service management (CRUD)
- [x] Client management (CRUD)
- [x] Ticket management
- [x] Dark mode toggle
- [x] Responsive design
- [x] Search functionality

### 🚧 In Progress
- [ ] Subscription management (CRUD)
- [ ] Analytics page enhancements
- [ ] Settings page functionality
- [ ] Email notifications

### 📅 Planned
- [ ] Real-time notifications (WebSockets)
- [ ] File upload functionality
- [ ] Advanced filtering and sorting
- [ ] Export data (CSV, PDF)
- [ ] Two-factor authentication
- [ ] Password reset functionality
- [ ] User activity logs
- [ ] API rate limiting
- [ ] Advanced analytics dashboard
- [ ] Payment integration

---

## 🔒 Security Features

- **Password Security**
  - Bcrypt hashing with salt rounds
  - Minimum password length enforcement
  - Password confirmation validation

- **JWT Authentication**
  - Secure token generation
  - Token expiration (24 hours)
  - HTTP-only cookie option (optional)

- **API Security**
  - CORS configuration
  - Input validation (express-validator)
  - MongoDB injection prevention
  - Role-based middleware
  - Protected route authentication

- **Frontend Security**
  - Environment variable protection
  - Secure token storage

---

## 🐛 Known Issues

- None currently reported

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



---

## 🙏 Acknowledgments

- Design inspiration from [Freshworks](https://www.freshworks.com/), [Zoho](https://www.zoho.com/), and [HubSpot](https://www.hubspot.com/)
- UI Components by [Shadcn UI](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---



---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ using React, Node.js, and MongoDB**