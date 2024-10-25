const express = require('express');
const mysql = require('mysql');
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: process.env.MY_SQL_DB_HOST,
    user: process.env.MY_SQL_DB_USER,
    password: process.env.MY_SQL_DB_PASSWORD,
    database: process.env.MY_SQL_DB_DATABASE
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const task = { description: req.body.description };
    console.log("task", task);
    db.query('INSERT INTO tasks SET ?', task, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
        if (err) throw err;
        res.send('Task updated.');
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.send('Task deleted.');
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});