// Select DOM Elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

const API_URL = 'http://localhost:3000/api/todos';
let todos = [];

// Fetch todos from backend
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        todos = await response.json();
        render();
    } catch (error) {
        console.error('Error fetching todos:', error);
        alert('Failed to load todos from server');
    }
}

// Add todo to backend
async function addTodoToBackend(text) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newTodo = await response.json();
        todos.push(newTodo);
        render();
    } catch (error) {
        console.error('Error adding todo:', error);
        alert('Failed to add todo');
    }
}

// Update todo in backend
async function updateTodoInBackend(id, updates) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const updatedTodo = await response.json();
        const index = todos.findIndex(t => t.id === id);
        if (index !== -1) {
            todos[index] = { ...todos[index], ...updates };
            render();
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        alert('Failed to update todo');
    }
}

// Delete todo from backend
async function deleteTodoFromBackend(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        todos = todos.filter(t => t.id !== id);
        render();
    } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Failed to delete todo');
    }
}

// Create a DOM node for a todo object
function createTodoNode(todo) {
    const li = document.createElement('li');

    // Checkbox to toggle completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener('change', () => {
        updateTodoInBackend(todo.id, { completed: checkbox.checked });
    });

    // Text of the todo
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.margin = '0 8px';
    if (todo.completed) {
        textSpan.style.textDecoration = 'line-through';
    }

    // Double-click to edit
    textSpan.addEventListener('dblclick', () => {
        const newText = prompt('Edit todo', todo.text);
        if (newText !== null && newText.trim()) {
            updateTodoInBackend(todo.id, { text: newText.trim() });
        }
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
        deleteTodoFromBackend(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    return li;
}

// Render the whole todo list
function render() {
    list.innerHTML = '';
    todos.forEach(todo => {
        const node = createTodoNode(todo);
        list.appendChild(node);
    });
}

// Add todo handler
function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    addTodoToBackend(text);
    input.value = '';
}

// Event listeners
addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Load todos when page loads
fetchTodos();