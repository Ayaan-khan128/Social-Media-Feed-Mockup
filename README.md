
# Social Media Feed Mockup

A full-stack social media feed application built using React, FastAPI, and MySQL.

## Features

- Create and publish posts
- View recent posts
- Like posts
- Add comments to posts
- View comments
- Delete posts
- Persistent data storage using MySQL

## Tech Stack

**Frontend:**
- React.js
- Vite
- CSS
- Lucide React

**Backend:**
- Python
- FastAPI
- SQLAlchemy
- Uvicorn

**Database:**
- MySQL
- PyMySQL

## Project Structure

```text
Social-Media-Feed-Mockup/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── models.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Social-Media-Feed-Mockup
```

### 2. Backend Setup

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

### 3. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE social_media_feed_db;
```

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/social_media_feed_db
```

Replace `YOUR_MYSQL_PASSWORD` with your own MySQL password.

### 4. Run the Backend

```bash
cd backend
uvicorn app:app --reload
```

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## Author
Ayaan khan
INTERN ID:CITS9302
Developed as part of the CODTECH IT Solutions Internship.
