
# 🚀 LinkedIn Clone - Professional Social Network

A full-stack social networking platform inspired by LinkedIn, built with modern web technologies. Connect with professionals, share your thoughts, and build your network.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.x with Vite  
- **Styling:** Tailwind CSS 3.x  
- **Routing:** React Router DOM 6.x  
- **HTTP Client:** Axios  
- **Icons:** Lucide React  
- **State Management:** React Context API  
- **Build Tool:** Vite  

### Backend
- **Runtime:** Node.js 18.x  
- **Framework:** Express.js 4.x  
- **Database:** MongoDB with Mongoose ODM  
- **Authentication:** JSON Web Tokens (JWT)  
- **Password Hashing:** bcryptjs  
- **Validation:** Built-in Express validators  
- **CORS:** CORS middleware  

### Development Tools
- **Hot Reload:** Vite HMR + Nodemon  
- **Code Quality:** ESLint + Prettier  
- **Version Control:** Git  
- **Package Manager:** npm  

---

## 📸 Screenshots

- 🏠 **Home Feed**: Modern, LinkedIn-inspired feed with post creation and engagement  
- 👤 **User Profiles**: Comprehensive profile pages with cover photos, skills, and activity  
- 🔍 **Advanced Search**: Real-time search with trending topics and user suggestions  
- 🔔 **Notifications**: Real-time notifications for likes, comments, and connections  

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Session management

### 👥 User Management
- Comprehensive user profiles
- Profile picture avatars & cover photos
- Skills, job title, company, location
- Profile views tracking
- Bio and personal description

### 📝 Post System
- Create, read, delete posts
- Rich text content support
- Real-time post feed
- Trending post algorithm
- Visibility controls

### 💬 Social Interactions
- Like, unlike, comment, and reply on posts
- Share posts with real-time counters
- Interaction history

### 🤝 Professional Networking
- Send/receive connection requests
- View mutual connections
- Connection suggestions algorithm
- Follow/unfollow users
- Network analytics

### 🔍 Search & Discovery
- Real-time search by name, skills, company, content
- Trending topics, hashtags
- Advanced filters and suggestions

### 🔔 Notifications
- Real-time like, comment, and connection request notifications
- Follow alerts, read/unread toggle, history tracking

### 📊 Analytics & Insights
- Profile view analytics
- Post engagement metrics
- Growth and activity timeline

### 🎨 Modern UI/UX
- Responsive design with dark/light theme
- Smooth animations, error handling, interactive components

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher  
- MongoDB 6.0 or higher  
- Git  
- Code editor (VS Code recommended)  

### Installation

#### Clone the repository
```bash
git clone https://github.com/yourusername/linkedin-clone.git
cd linkedin-clone
```

#### Install Backend Dependencies
```bash
cd server
npm install
```

#### Install Frontend Dependencies
```bash
cd ../client
npm install
```

#### Environment Setup
Create `.env` file in `server/`:

```env
MONGODB_URI=mongodb://localhost:27017/linkedin-clone
# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin-clone

JWT_SECRET=your-super-secure-jwt-secret-key-here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 📁 Project Structure

```
linkedin-clone/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
```

---

## 🔗 API Documentation

### Base URL
```
http://localhost:5000/api
```

#### Authentication Endpoints
| Method | Endpoint        | Description           | Auth |
|--------|------------------|-----------------------|------|
| POST   | /auth/register   | Register new user     | ❌   |
| POST   | /auth/login      | Login                 | ❌   |
| GET    | /auth/me         | Current user info     | ✅   |

#### Post Endpoints
| Method | Endpoint                | Description                | Auth |
|--------|--------------------------|-----------------------------|------|
| GET    | /posts                   | Get all posts              | ❌   |
| POST   | /posts                   | Create new post            | ✅   |
| POST   | /posts/:id/comment       | Add comment                | ✅   |

#### User Endpoints
| Method | Endpoint                     | Description              | Auth |
|--------|-------------------------------|--------------------------|------|
| GET    | /users/:id                   | Get user profile         | ❌   |
| PUT    | /users/profile              | Update profile           | ✅   |
| POST   | /users/:id/connect          | Connect request          | ✅   |

#### Notification Endpoints
| Method | Endpoint                     | Description              | Auth |
|--------|-------------------------------|--------------------------|------|
| GET    | /notifications               | Fetch notifications      | ✅   |
| PUT    | /notifications/:id/read     | Mark as read             | ✅   |

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
vercel --prod
```

### Backend (Render/Railway)
```bash
cd server
npm start
```

---

## 🧪 Testing

### Manual Checklist

#### Authentication
- Register/Login
- JWT handling
- Route protection

#### Posts
- Create/View/Delete
- Like, Comment, Share

---

## 📌 License

MIT
