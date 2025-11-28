# Deployment Guide
This guide outlines the steps to deploy your application with the Frontend on Vercel, Backend on Render, and Database on MongoDB Atlas.

## 1. Database: MongoDB Atlas
1.  **Create Cluster**: Log in to MongoDB Atlas and create a new cluster (free tier is fine).
2.  **Network Access**: Go to "Network Access" and add IP Address `0.0.0.0/0` (allow access from anywhere) so Render can connect.
3.  **Database User**: Go to "Database Access" and create a database user (remember the username and password).
4.  **Connection String**: Click "Connect" -> "Drivers" and copy the connection string. It looks like:
    `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *Replace `<password>` with your actual password.*

## 2. Backend: Render
1.  **Create Web Service**: Log in to Render, click "New" -> "Web Service".
2.  **Connect Repo**: Connect your GitHub repository.
3.  **Root Directory**: Set "Root Directory" to `server`.
4.  **Build Command**: `npm install`
5.  **Start Command**: `node index.js`
6.  **Environment Variables**: Add the following environment variables:
    *   `MONGODB_URI`: Paste your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A long random string (e.g., `mysecretkey123`).
    *   `NODE_ENV`: `production`
    *   `CLIENT_URL`: The URL of your Vercel frontend (you can update this later after deploying frontend, e.g., `https://my-app.vercel.app`).
    *   `GOOGLE_MAPS_API_KEY`: Your Google Maps API Key.
7.  **Deploy**: Click "Create Web Service". Wait for it to deploy. Copy the **Backend URL** (e.g., `https://my-api.onrender.com`).

## 3. Frontend: Vercel
1.  **Import Project**: Log in to Vercel, click "Add New..." -> "Project".
2.  **Connect Repo**: Import the same GitHub repository.
3.  **Framework Preset**: Select "Vite".
4.  **Root Directory**: Click "Edit" next to Root Directory and select `client`.
5.  **Environment Variables**: Add the following:
    *   `VITE_API_URL`: Paste your **Backend URL** from Render (e.g., `https://my-api.onrender.com/api`). **Important**: Add `/api` at the end.
    *   `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API Key.
6.  **Deploy**: Click "Deploy".

## 4. Final Configuration
1.  **Update Backend CORS**: Once Vercel deployment is done, copy the **Frontend URL** (e.g., `https://my-app.vercel.app`).
2.  **Update Render**: Go back to Render -> Environment Variables.
3.  **Update CLIENT_URL**: Set `CLIENT_URL` to your Vercel Frontend URL.
4.  **Redeploy Backend**: Render might auto-deploy on variable change, or you can manually trigger a deploy.

## Troubleshooting
*   **CORS Errors**: If you see CORS errors in the browser console, double-check that `CLIENT_URL` in Render matches your Vercel URL exactly (no trailing slash usually).
*   **Map Not Loading**: Ensure `VITE_GOOGLE_MAPS_API_KEY` is set in Vercel and `GOOGLE_MAPS_API_KEY` is set in Render.
*   **Blank Screen**: Check the browser console for errors. If it says "404 Not Found" for API calls, check `VITE_API_URL`.
