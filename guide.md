# Todo List Application - Complete Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download here](https://dev.mysql.com/downloads/)
- A code editor (VS Code recommended)

## Project Structure

```
todo-app/
│
├── backend/
│   ├── server.js
│   ├── init-db.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── SETUP_INSTRUCTIONS.md
```

## Setup Instructions

### Step 1: Install MySQL

1. Download and install MySQL from the official website
2. During installation, set a root password (remember this!)
3. Start the MySQL service

**For Windows:**
- MySQL should start automatically after installation
- Check in Services (services.msc)
```


### Step 2: Set Up the Backend

1. **Create the backend folder and navigate to it:**
```bash
mkdir backend
cd backend
```

2. **Create all backend files:**
   - Create `server.js` (copy the code provided)
   - Create `init-db.js` (copy the code provided)
   - Create `package.json` (copy the code provided)
   - Create `.env` (copy the code provided)

3. **Configure the .env file:**
   
   Open `.env` and update with your MySQL credentials:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=todo_db
   ```

4. **Install Node.js dependencies:**
```bash
npm install
```

This will install:
- express (web framework)
- cors (enable cross-origin requests)
- mysql2 (MySQL database driver)
- dotenv (environment variables)

5. **Initialize the database:**
```bash
npm run init-db
```

This creates the database and todos table automatically.

6. **Start the backend server:**
```bash
npm start
```

You should see:
```
Successfully connected to MySQL database
Server is running on http://localhost:3000
```

### Step 3: Set Up the Frontend

1. **Create the frontend folder:**
```bash
cd ..
mkdir frontend
cd frontend
```

2. **Create the frontend files:**
   - Create `index.html` (use your existing file)
   - Create `script.js` (use your existing file)
   - Create `style.css` (use your existing file)

3. **Open the application:**
   
   Simply double-click `index.html` or open it in your browser:
   ```
   file:///path/to/frontend/index.html
   ```

   Or use a local server like Live Server in VS Code.

## Testing the Application

1. **Check if backend is running:**
   
   Open your browser and go to:
   ```
   http://localhost:3000/api/todos
   ```
   
   You should see an empty array: `[]`

2. **Test the frontend:**
   - Open the todo list in your browser
   - Try adding a new todo
   - Try editing a todo (double-click)
   - Try marking as complete
   - Try deleting a todo

3. **Verify database storage:**
   
   Open MySQL command line:
   ```bash
   mysql -u root -p
   ```
   
   Then run:
   ```sql
   USE todo_db;
   SELECT * FROM todos;
   ```
   
   You should see your todos stored in the database!

## API Endpoints

Your backend provides these endpoints:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Troubleshooting

### Backend won't start

**Error: "Access denied for user"**
- Check your MySQL password in `.env`
- Make sure MySQL is running

**Error: "Cannot find module"**
- Run `npm install` again
- Make sure you're in the backend directory

### Frontend can't connect to backend

**Error: "Failed to load todos from server"**
- Make sure backend is running on port 3000
- Check browser console for CORS errors
- Verify the API_URL in script.js is correct

### Database errors

**Error: "Unknown database"**
- Run `npm run init-db` to create the database
- Check database name in `.env`

**Error: "Table doesn't exist"**
- Run `npm run init-db` again
- Verify MySQL connection

## Development Mode

For development with auto-restart on file changes:

```bash
npm run dev
```

This uses nodemon to automatically restart the server when you make changes.

## Production Deployment

For production, you would:

1. Set up a production MySQL database
2. Update `.env` with production credentials
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```
4. Deploy frontend to a web server (Netlify, Vercel, etc.)
5. Update the API_URL in frontend to point to your production backend

## Additional Notes

- **Database Backups:** Regularly backup your MySQL database
- **Security:** Never commit `.env` file to Git (add to .gitignore)
- **CORS:** Currently allows all origins. In production, restrict to your domain
- **Validation:** Add more input validation for production use

## Need Help?

If you encounter any issues:
1. Check that MySQL is running
2. Verify all dependencies are installed
3. Check the console for error messages
4. Ensure ports 3000 is not in use by another application

Happy coding! 🚀

command to acces databse 
1. cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
2. mysql -u root -p
3. show databses;
4. use todo_db;
5. show tables;
6. select*from todos;

cd D:\project\TODO\backend
npm start
```

You should see:
```
Successfully connected to MySQL database
Server is running on http://localhost:3000
```

If not running, start it first!

---

## Step 2: Check Backend Logs

When you try to add a todo, look at your backend terminal. Do you see any error messages? Tell me what it says.

---

## Step 3: Test API Directly

Open your browser and go to:
```
http://localhost:3000/api/todos