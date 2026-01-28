const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Successfully connected to MySQL database');
    connection.release();
});

// Routes

// Root route - API info
app.get('/', (req, res) => {
    res.json({
        message: 'Todo List API is running!',
        endpoints: {
            'GET /api/todos': 'Get all todos',
            'GET /api/todos/:id': 'Get single todo',
            'POST /api/todos': 'Create new todo',
            'PUT /api/todos/:id': 'Update todo',
            'DELETE /api/todos/:id': 'Delete todo'
        }
    });
});

// GET all todos
app.get('/api/todos', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM todos ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

// GET single todo by ID
app.get('/api/todos/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.query(
            'SELECT * FROM todos WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ error: 'Failed to fetch todo' });
    }
});

// POST create new todo
app.post('/api/todos', async (req, res) => {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Todo text is required' });
    }
    
    try {
        const [result] = await promisePool.query(
            'INSERT INTO todos (text, completed) VALUES (?, ?)',
            [text.trim(), false]
        );
        
        const [newTodo] = await promisePool.query(
            'SELECT * FROM todos WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(newTodo[0]);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
    const { text, completed } = req.body;
    const { id } = req.params;
    
    try {
        // Check if todo exists
        const [existing] = await promisePool.query(
            'SELECT * FROM todos WHERE id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        // Build update query dynamically
        let updateFields = [];
        let values = [];
        
        if (text !== undefined) {
            updateFields.push('text = ?');
            values.push(text);
        }
        
        if (completed !== undefined) {
            updateFields.push('completed = ?');
            values.push(completed);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(id);
        
        await promisePool.query(
            `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
            values
        );
        
        const [updated] = await promisePool.query(
            'SELECT * FROM todos WHERE id = ?',
            [id]
        );
        
        res.json(updated[0]);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const [result] = await promisePool.query(
            'DELETE FROM todos WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});