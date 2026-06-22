# TutorConnect Deployment Guide

This document lists the required environment configurations and variables needed to successfully deploy both the frontend and backend of TutorConnect (specifically on platforms like **Vercel**).

---

## 🛠️ Required Environment Variables

To configure and run the application in a production environment, set the following environment variables:

| Variable Name | Required For | Description / Example Value |
| :--- | :--- | :--- |
| **`VITE_API_URL`** | Frontend | The backend API root URL. Points to the live API endpoint (e.g., `https://tutorconnect-api.vercel.app/api` or `https://tutor-connect.vercel.app/api`). If blank, it defaults to the relative `/api` route. |
| **`MONGODB_URI`** | Backend | Connection string for MongoDB Atlas database. (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/tutorconnect?retryWrites=true&w=majority`) |
| **`JWT_SECRET`** | Backend | Secret signing key used to sign and verify JSON Web Tokens (e.g., `my_secure_jwt_secret_key_2026`) |
| **`CLOUDINARY_CLOUD_NAME`** | Backend | Cloudinary Cloud Name for file/image uploads |
| **`CLOUDINARY_API_KEY`** | Backend | Cloudinary API Key |
| **`CLOUDINARY_API_SECRET`**| Backend | Cloudinary API Secret |

---

## 🌎 VITE_API_URL Configuration

### 1. Single Project Deployment (Recommended)
If deploying the frontend and backend together in a **single Vercel project** using the routing configuration in `vercel.json`:
* **VITE_API_URL**: You do **not** need to set this environment variable, or you can leave it blank. 
* The frontend will make relative requests to `/api/*`, which Vercel's rewrite engine automatically forwards to the serverless backend function inside `/api/index.cjs` (loading the Express application).

### 2. Multi-Project / Split Deployment
If deploying the frontend and backend separately:
* **VITE_API_URL**: Set this environment variable in the frontend project's Vercel settings to the backend project's live URL, including the `/api` suffix.
  * *Example*: `https://tutorconnect-api.vercel.app/api`

---

## 🛡️ Verification
* When the frontend runs, it prints the status of the `VITE_API_URL` configuration inside browser developer tools console logs.
* If `VITE_API_URL` is undefined or missing in production, a warning banner will render at the very top of the webpage to alert you.
* The frontend logs all request URLs, base URLs, response statuses, and errors directly to the browser console for live debugging.
