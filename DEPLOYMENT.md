# 🚀 Royal Chairs — Production Deployment Guide

This guide details how to deploy the entire Royal Chairs platform into production:
- **Backend API (`server`)** ➔ [Render](https://render.com) (Web Service)
- **Customer Storefront (`client`)** ➔ [Vercel](https://vercel.com) (Vite React SPA)
- **Admin Command Center (`admin`)** ➔ [Vercel](https://vercel.com) (Vite React SPA)
- **Database** ➔ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 📋 Overview of Environment Variables

### 1. Backend Server (`server`) — Render Dashboard
| Variable Name | Example / Production Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & logs |
| `PORT` | `5000` *(Render sets this automatically)* | Port the Express server listens on |
| `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/royal?retryWrites=true&w=majority` | MongoDB Atlas cluster connection string |
| `CLIENT_URL` | `https://royalchairs-client.vercel.app` | URL of the live client frontend (for CORS) |
| `ADMIN_URL` | `https://royalchairs-admin.vercel.app` | URL of the live admin panel (for CORS) |
| `JWT_SECRET` | `your_super_strong_random_jwt_secret_key_2026` | Secret key for signing and verifying tokens |
| `GOOGLE_CLIENT_ID` | `your_google_client_id.apps.googleusercontent.com` | Google OAuth Client ID *(optional)* |
| `GOOGLE_CLIENT_SECRET` | `your_google_client_secret` | Google OAuth Client Secret *(optional)* |

> **Tip on CORS**: `CLIENT_URL` and `ADMIN_URL` support comma-separated origins (e.g. `https://domain1.com,https://preview.domain2.com`). Also, all `*.vercel.app` domains are automatically whitelisted.

---

### 2. Client Storefront (`client`) — Vercel Dashboard
| Variable Name | Production Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-server-name.onrender.com/api` | Render backend API endpoint URL |
| `VITE_GOOGLE_CLIENT_ID` | `your_google_client_id.apps.googleusercontent.com` | Google OAuth Client ID *(optional)* |

---

### 3. Admin Command Center (`admin`) — Vercel Dashboard
| Variable Name | Production Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-server-name.onrender.com/api` | Render backend API endpoint URL |
| `VITE_CLIENT_URL` | `https://royalchairs-client.vercel.app` | Storefront URL for quick navigation |

---

## 🛠️ Step-by-Step Deployment Instructions

### Step 1: Prepare MongoDB Atlas
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Go to **Network Access** ➔ Click **Add IP Address** ➔ Select **Allow Access From Anywhere (`0.0.0.0/0`)** (required for dynamic cloud hosting like Render).
3. Go to **Database Access** ➔ Ensure you have a user created with Read/Write privileges.
4. Go to **Clusters** ➔ Click **Connect** ➔ Choose **Drivers (Node.js)** ➔ Copy the connection string.
5. Replace `<password>` and database name (e.g. `royal`) in the URI string.

---

### Step 2: Deploy Backend Server to Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository containing `RoyalChairs`.
3. Configure the following fields:
   - **Name**: `royalchairs-server` (or your preferred name)
   - **Region**: Choose the closest region (e.g. Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = *(Your MongoDB Atlas URI from your .env)*
   - `JWT_SECRET` = *(Your JWT secret)*
   - `GOOGLE_CLIENT_ID` = *(Your Google OAuth client ID)*
   - `GOOGLE_CLIENT_SECRET` = *(Your Google OAuth client secret)*
5. Click **Create Web Service**.
6. Once deployed, note down your Render service URL (e.g. `https://royalchairs-server.onrender.com`).
   - Test by visiting `https://royalchairs-server.onrender.com/api/health` in your browser.

---

### Step 3: Deploy Customer Storefront (`client`) to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** ➔ **Project**.
2. Import your repository.
3. Configure the project:
   - **Project Name**: `royalchairs-client`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `client`
   - **Build and Output Settings**: Defaults are pre-configured (`npm run build` and `dist`)
4. Expand **Environment Variables** and add:
   - `VITE_API_URL` = `https://royalchairs-server.onrender.com/api` (use your actual Render backend URL with `/api` at the end)
   - `VITE_GOOGLE_CLIENT_ID` = *(Your Google OAuth client ID)*
5. Click **Deploy**.
6. Note down the deployed URL (e.g. `https://royalchairs-client.vercel.app`).

---

### Step 4: Deploy Admin Command Center (`admin`) to Vercel
1. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New...** ➔ **Project**.
2. Import the same repository again for the admin project.
3. Configure the project:
   - **Project Name**: `royalchairs-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `admin`
   - **Build and Output Settings**: Defaults are pre-configured (`npm run build` and `dist`)
4. Expand **Environment Variables** and add:
   - `VITE_API_URL` = `https://royalchairs-server.onrender.com/api`
   - `VITE_CLIENT_URL` = `https://royalchairs-client.vercel.app` (your client storefront Vercel URL from Step 3)
5. Click **Deploy**.
6. Note down the deployed URL (e.g. `https://royalchairs-admin.vercel.app`).

---

### Step 5: Update Server CORS on Render
1. Open your **Render Dashboard** ➔ Go to `royalchairs-server` ➔ **Environment**.
2. Add or update:
   - `CLIENT_URL` = `https://royalchairs-client.vercel.app`
   - `ADMIN_URL` = `https://royalchairs-admin.vercel.app`
3. Click **Save Changes** (Render will automatically re-deploy with updated environment variables).
