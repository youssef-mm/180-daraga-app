# 🔄 180 Daraga — Attendance & Meeting Management Portal

An integrated full-stack cross-platform application developed for **180 Daraga** organization to streamline meeting management, general assembly attendance tracking, and Highboard responses.

---

## 📱 Features

* **General Attendance Portal:** Browse upcoming meetings and track confirmation deadlines.
* **Seamless Authentication:** Permissive JWT-based auth flow tailored for Highboard members.
* **Meeting Management:** Dedicated interface for authorized members to schedule and create new meetings.
* **Responses Dashboard:** Real-time visibility into attendance responses and status reports.
* **Branded UI:** Modern React Native mobile UI integrated with official 180 Daraga identity assets.

---

## 🛠️ Tech Stack

### **Frontend (Mobile App)**
* **Framework:** React Native (Expo)
* **Navigation:** React Navigation (Native Stack)
* **HTTP Client:** Axios
* **Icons & Assets:** Custom UI components with embedded organization design assets

### **Backend (REST API)**
* **Runtime Environment:** Node.js & Express.js
* **Database & ORM:** MySQL with Sequelize ORM
* **Authentication:** JSON Web Tokens (JWT)

---

## 📁 Repository Structure

```text
180-daraga-app/
├── 180-mobile-app/      # React Native (Expo) Frontend Application
│   ├── assets/          # Organization brand logos and visual assets
│   ├── src/             # Screens, Navigation, API Config, and Context
│   └── package.json
│
└── backend/             # Express.js REST API Backend
    ├── controllers/     # Authentication & Meeting controllers
    ├── middlewares/     # JWT Authentication middleware
    ├── routes/          # Express route endpoints
    ├── server.js        # Server entry point
    └── package.json
