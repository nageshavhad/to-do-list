document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        addTask(description);
    });
});

function fetchTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.description}</span>
                    <button onclick="editTask(${task.id}, '${task.description}')">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                    <button onclick="toggleComplete(${task.id}, ${task.completed})">${task.completed ? 'Unmark' : 'Complete'}</button>
                `;
                taskList.appendChild(li);
            });
        });
}

function addTask(description) {
    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    }).then(() => {
        document.getElementById('description').value = '';
        fetchTasks();
    });
}

function editTask(id, description) {
    const newDescription = prompt('Edit task description:', description);
    if (newDescription) {
        fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: newDescription, completed: false })
        }).then(() => {
            fetchTasks();
        });
    }
}

function deleteTask(id) {
    fetch(`/tasks/${id}`, {
        method: 'DELETE'
    }).then(() => {
        fetchTasks();
    });
}

function toggleComplete(id, completed) {
    fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !completed })
    }).then(() => {
        fetchTasks();
    });
}