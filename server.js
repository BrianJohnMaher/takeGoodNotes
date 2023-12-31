const express = require('express');
const path = require('path');
const data = require('./db/db.json')
const PORT = process.env.PORT || 3001;
// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// this will be retreiving the files 
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        title: req.body.title, 
        text: req.body.text,
        id: uuid()
    }

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added`);
});


// this will be returning the notes being requested
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);

