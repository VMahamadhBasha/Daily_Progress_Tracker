# Student Daily Progress Tracker

A clean, modern, and beginner-friendly personal productivity application for a single student to track long-term learning goals, log daily progress, study hours, and visualize accomplishments on a colored monthly calendar.

Developed using **React (Vite) + Tailwind CSS** on the frontend, and **Spring Boot (Spring Data JPA) + MySQL** on the backend.

---

## Folder Structure

```text
Progress_Tracker/
├── backend/                  # Spring Boot backend source code
│   ├── src/main/java/com/tracker/
│   │   ├── controller/      # REST API Controllers
│   │   ├── entity/          # JPA Entity definitions
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── service/         # Business logic services
│   │   └── StudentTrackerApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml               # Maven configuration
│
├── frontend/                 # React frontend source code (Vite)
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Stats, Logger, Calendar, etc.)
│   │   ├── pages/           # Pages (Dashboard, TaskManager)
│   │   ├── services/        # Axios API client services
│   │   ├── App.jsx
│   │   ├── index.css        # Global CSS overrides & tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
└── db/                       # Database scripts
    ├── schema.sql            # Table definitions
    └── data.sql              # Mock seed data
```

---

## Database Setup (MySQL)

1. Ensure MySQL is running on your machine.
2. Log into your MySQL CLI or manager (like Workbench or phpMyAdmin).
3. Open and execute the script [schema.sql](file:///e:/Projects/Progress_Tracker/db/schema.sql) to create the `student_tracker` database and its tables.
4. Execute [data.sql](file:///e:/Projects/Progress_Tracker/db/data.sql) to insert mock tasks and daily progress records covering the last few days to populate the dashboard and calendar.

---

## Local Setup

### 1. Spring Boot Backend
1. Open [application.properties](file:///e:/Projects/Progress_Tracker/backend/src/main/resources/application.properties) and update the MySQL credentials (`spring.datasource.username` and `spring.datasource.password`) with yours if different from defaults:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=password
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the backend application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   The backend server will start on `http://localhost:8080`.

### 2. React Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## Deployment Steps

This section details how to deploy the application on **Vercel** (for the React Frontend) and **Railway** (for the Spring Boot Backend + MySQL Database).

### Step 1: Deploy Database & Spring Boot Backend on Railway

[Railway](https://railway.app/) is a cloud platform that makes it extremely simple to deploy databases and web servers in one environment.

1. **Create a MySQL Instance on Railway:**
   * Go to [Railway.app](https://railway.app/), create an account, and log in.
   * Click **New Project** &rarr; **Provision MySQL**.
   * Railway will create a MySQL database container. Once provisioned, click on it, select **Variables**, and copy the connection credentials (`MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`).

2. **Deploy the Spring Boot Application:**
   * Push your project code to a private GitHub repository.
   * On Railway, click **New Project** &rarr; **GitHub Repo** &rarr; Select your repository.
   * Set the root directory of this service to `/backend` in the settings tab.
   * Under the **Variables** tab of the service, add the environment variables to dynamically hook into the Railway database instead of localhost:
     * `SPRING_DATASOURCE_URL` &rarr; `jdbc:mysql://${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}?useSSL=false&serverTimezone=UTC`
     * `SPRING_DATASOURCE_USERNAME` &rarr; `${{MYSQLUSER}}`
     * `SPRING_DATASOURCE_PASSWORD` &rarr; `${{MYSQLPASSWORD}}`
     * `SERVER_PORT` &rarr; `${{PORT}}`
   * Railway will automatically detect the `pom.xml`, build the Spring Boot application using Java, and deploy it to a public URL (e.g. `https://your-backend.up.railway.app`). Generate a domain URL for your backend from the service settings page.

---

### Step 2: Deploy React Frontend on Vercel

[Vercel](https://vercel.com/) is optimized for static sites and frontend frameworks.

1. **Update API Endpoint URL:**
   * Update [api.js](file:///e:/Projects/Progress_Tracker/frontend/src/services/api.js) to point to your Railway backend URL instead of localhost.
   * *Tip:* Best practice is to use an environment variable:
     `const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';`

2. **Deploy via GitHub on Vercel:**
   * Go to [Vercel](https://vercel.com/), log in, and click **Add New** &rarr; **Project**.
   * Import your GitHub repository.
   * In the configure project settings:
     * Set **Framework Preset** to `Vite`.
     * Set **Root Directory** to `frontend`.
     * Under **Environment Variables**, add:
       * `VITE_API_URL` &rarr; `https://your-backend.up.railway.app` (the public URL of your Railway backend).
   * Click **Deploy**. Vercel will build the frontend and provide you with a production-ready website URL (e.g. `https://your-app.vercel.app`).
