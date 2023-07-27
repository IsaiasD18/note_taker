//Declare the dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const DB_PATH = path.join(__dirname, './db/db.json');
const { v4: uuidv4} = require('uuid');

//Declare the express app
const app = express();

//Set the port
const PORT = process.env.PORT ||  3333;

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//GET /notes should return the notes.html file.
app.get('/notes', (clienteReq, serverRes) => {
    serverRes.sendFile(path.join(__dirname, './public/notes.html'));
});


//GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (clienteReq, serverRes) => {
    const notes = getData();
    serverRes.json(notes);
  });


function getData() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};


// GET * should return the index.html file.
app.get('*', (clienteReq, serverRes) => {
    serverRes.sendFile(path.join(__dirname, './public/index.html'));
  });

  



//POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. 
app.post('/api/notes', (clienteReq, serverRes) => {
    const data = getData();
    const newNote = {
      id: uuidv4(),
      ...clienteReq.body
    };
    data.push(newNote);
    saveData(data);
    serverRes.json(newNote);
  });

function saveData(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    console.log('Data saved successfully!');
}

//Delete note

app.delete('/api/notes/:id', (clienteReq, serverRes) => {
    fs.readFile(path.join(__dirname,  "./db/db.json"), 'utf8', (err, data) => {
      let note = JSON.parse(data);
     note = note.filter((e) => {
        return e.id !== clienteReq.params.id;
      });
      fs.writeFile(
        path.join(__dirname,  "./db/db.json"),
        JSON.stringify(note, null, 2),
        (err, data) => {
          if (err) throw err;
          serverRes.json(note);
        }
      );
    });
  });

//Start the server 
app.listen(PORT, () => console.log('Server started on port %s', PORT));