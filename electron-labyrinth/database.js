const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./labyrinth.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE,

            password TEXT,

            role TEXT DEFAULT 'user'
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS labyrinths (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            name TEXT,

            difficulty INTEGER,

            size TEXT,

            maze TEXT
        )
    `);

});

module.exports = db;