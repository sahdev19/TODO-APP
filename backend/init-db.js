const mysql = require('mysql2');
require('dotenv').config();

// Create connection without database selection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
});

// SQL to create database and table
const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'todo_db'}`;

const useDatabase = `USE ${process.env.DB_NAME || 'todo_db'}`;

const createTable = `
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

// Execute initialization
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    
    console.log('Connected to MySQL');
    
    // Create database
    connection.query(createDatabase, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            connection.end();
            process.exit(1);
        }
        
        console.log(`Database '${process.env.DB_NAME || 'todo_db'}' created or already exists`);
        
        // Use the database
        connection.query(useDatabase, (err) => {
            if (err) {
                console.error('Error selecting database:', err);
                connection.end();
                process.exit(1);
            }
            
            // Create table
            connection.query(createTable, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    connection.end();
                    process.exit(1);
                }
                
                console.log('Table "todos" created or already exists');
                console.log('\nDatabase initialization completed successfully!');
                console.log('You can now run: npm start');
                
                connection.end();
            });
        });
    });
});