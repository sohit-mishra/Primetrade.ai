# 🚀 Scalable Web App with Authentication & Dashboard

### **Frontend Developer Intern Assignment — Bajarangs x PrimeTrade.AI**

This project demonstrates a **modern, scalable full-stack web application** built with **React.js (Frontend)** and **Node.js + Express (Backend)**.  
It includes **JWT-based authentication**, **MongoDB integration**, and a **responsive dashboard** for managing tasks.

---

## 🌐 Live Demo

🔗 **Frontend Page:** [https://your-frontend-app.vercel.app](https://your-frontend-app.vercel.app)  
🔗 **Backend API:** [https://api-primetrade.onrender.com/api/v1](https://api-primetrade.onrender.com/api/v1)

*(Replace the above URLs with your actual deployment links before submission.)*

---

## 🧠 Overview

You are viewing a **full-stack project** that includes:

- ✅ **Frontend (React.js + TailwindCSS)**
- ✅ **Backend (Node.js + Express + MongoDB + Redis)**
- ✅ **Authentication (JWT + bcrypt)**
- ✅ **CRUD operations (Tasks API)**
- ✅ **Profile Management**
- ✅ **Scalable, modular structure**
- ✅ **Error handling, CORS, middleware setup**

---

## ⚙️ Tech Stack

### **Frontend**
- React.js (NextJs or CRA)
- TailwindCSS (Responsive UI)
- Axios (API integration)
- React Router (Protected Routes)
- React Hook Form (Validation)
- Context API

### **Backend**
- Node.js + Express
- MongoDB (Mongoose ODM)
- Redis (Session caching)
- JWT Authentication
- bcrypt.js (Password hashing)
- CORS, dotenv, morgan (logging)

---

## 🧩 API Endpoints

### **User Routes**
| Method | Endpoint | Description | Auth |
|---------|-----------|-------------|------|
| `POST` | `/api/v1/register` | Register new user | ❌ |
| `POST` | `/api/v1/login` | Login user | ❌ |
| `POST` | `/api/v1/logout` | Logout user | ✅ |
| `GET` | `/api/v1/profile` | Get user profile | ✅ |
| `PUT` | `/api/v1/update-profile` | Update user profile | ✅ |
| `PUT` | `/api/v1/change-password` | Change password | ✅ |

### **Task Routes**
| Method | Endpoint | Description | Auth |
|---------|-----------|-------------|------|
| `GET` | `/api/v1/all` | Get all tasks (by owner) | ✅ |
| `POST` | `/api/v1/post` | Create new task | ✅ |
| `GET` | `/api/v1/:id` | Get single task | ✅ |
| `PUT` | `/api/v1/update/:id` | Update task | ✅ |
| `PUT` | `/api/v1/updateStatus/:id` | Update task status | ✅ |
| `DELETE` | `/api/v1/delete/:id` | Delete task | ✅ |

---

## 🔐 Authentication Flow

1. User registers → password is **hashed** using `bcrypt`
2. On login → a **JWT token** is generated and stored in HTTP-only cookie
3. Protected routes validate token via **auth middleware**
4. Logout clears token and session cache (Redis)

---

## 🧰 Installation & Setup

### **1. Clone the repository**
```bash
git clone https://github.com/sohit-mishra/Primetrade.ai.git
cd Primetrade.ai
```

### **2. Backend Setup**
```
cd Backend
npm install
```

### **3. Create a .env file**
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

### **4. Run backend:**
```
npm run dev
```

## 🧰 Frontend Setup
```
cd ../frontend
npm install
npm run dev
```

## 🧪 Testing the APIs

You can test all API routes using:

- 🧰 **Postman**
- 🌐 **Frontend Integration**

A Postman Collection file is included in the repository.

---

## 🧭 Deployment Notes

### **Frontend**
- Host on **Vercel / Netlify**

### **Backend**
- Host on **Render / Railway / AWS EC2**
- Use **MongoDB Atlas**
- Use **Redis Cloud** for caching

### **Scaling Plan**
- Move to **microservice architecture** for auth and task modules  
- Use **Nginx reverse proxy** for load balancing  
- Add **rate limiting** & **helmet.js** for API security  
- Use **React Query** for caching and performance optimization  

---

## 📸 Dashboard Preview

**Features:**
- Task List with CRUD operations  
- User Profile Update  
- Search & Filter functionality  
- Logout and Auth protection  

*(Add screenshots if available)*

---

## 🧾 Deliverables

✅ Frontend + Backend (GitHub Repository)  
✅ Working Auth Flow (Register/Login/Logout)  
✅ Dashboard with CRUD Tasks  
✅ Postman Collection / API Docs  
✅ Notes on Scaling  
✅ Live Frontend Link  

---

## 📨 Submission

**Send the GitHub repo and log files to:**  
📩 `saami@bajarangs.com`, `nagasai@bajarangs.com`, `chetan@bajarangs.com`  
**CC:** `sonika@primetrade.ai`  
**Subject:** `Frontend Developer Task`

---

## 🧑‍💻 Author

**Name:** Sohit Mishra  
**LinkedIn:** [https://www.linkedin.com/in/sohitmishra](https://www.linkedin.com/in/sohitmishra)  
**Portfolio:** [https://github.com/sohit-mishra](https://github.com/sohit-mishra)

---

💡 *This project demonstrates modern full-stack development practices with focus on scalability, security, and seamless frontend-backend integration.*
