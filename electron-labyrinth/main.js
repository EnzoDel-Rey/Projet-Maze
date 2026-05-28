const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const path = require('path');
const db = require('./database');
const auth = require('./auth');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('./views/login.html');
}

app.whenReady().then(() => {
    createWindow();
});

// ==========================================
//          FONCTIONNALITÉS JOUEUR
// ==========================================

// REGISTER
ipcMain.handle('register', async (event, data) => {
    return new Promise((resolve) => {
        auth.register(
            data.username,
            data.password,
            (err, token) => {
                if(err) {
                    resolve({ success: false, error: err.message });
                } else {
                    resolve({ success: true, token });
                }
            }
        );
    });
});

// LOGIN
ipcMain.handle('login', async (event, data) => {
    return new Promise((resolve) => {
        auth.login(
            data.username,
            data.password,
            (err, token, user) => {
                if(err) {
                    resolve({ success: false, error: err });
                } else {
                    resolve({ success: true, token, user });
                }
            }
        );
    });
});

// SAVE MAZE
ipcMain.handle('save-maze', async (event, data) => {
    return new Promise((resolve) => {
        db.run(
            `
            INSERT INTO labyrinths (user_id, name, difficulty, size, maze)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                data.user_id,
                data.name,
                data.difficulty,
                data.size,
                JSON.stringify(data.maze)
            ],
            function(err) {
                if(err) {
                    console.error("Erreur SQLite SAVE:", err);
                    resolve({ success: false });
                } else {
                    resolve({ success: true });
                }
            }
        );
    });
});

// GET MAZES (Pour le joueur courant)
ipcMain.handle('get-mazes', async (event, userId) => {
    return new Promise((resolve) => {
        db.all(
            `
            SELECT * FROM labyrinths WHERE user_id = ?
            `,
            [userId],
            (err, rows) => {
                if(err) {
                    console.error("Erreur SQLite GET:", err);
                    resolve([]);
                } else {
                    resolve(rows);
                }
            }
        );
    });
});

// UPDATE MAZE
ipcMain.handle('update-maze', async (event, data) => {
    return new Promise((resolve) => {
        db.run(
            `
            UPDATE labyrinths 
            SET name = ? 
            WHERE id = ?
            `,
            [data.name, data.id],
            function(err) {
                if(err) {
                    console.error("Erreur SQLite UPDATE:", err);
                    resolve({ success: false });
                } else {
                    resolve({ success: true });
                }
            }
        );
    });
});

// DELETE MAZE (Pour le joueur courant)
ipcMain.handle('delete-maze', async (event, id) => {
    return new Promise((resolve) => {
        db.run(
            `
            DELETE FROM labyrinths WHERE id = ?
            `,
            [id],
            function(err) {
                if(err) {
                    console.error("Erreur SQLite DELETE:", err);
                    resolve({ success: false });
                } else {
                    resolve({ success: true });
                }
            }
        );
    });
});

// ==========================================
//        FONCTIONNALITÉS PANEL ADMIN
// ==========================================

// 1. OBTENIR TOUS LES UTILISATEURS
ipcMain.handle('get-all-users', async () => {
    return new Promise((resolve) => {
        db.all("SELECT id, username, role FROM users", [], (err, rows) => {
            if (err) {
                console.error("Erreur SQLite Admin Users:", err);
                resolve([]);
            } else {
                resolve(rows || []);
            }
        });
    });
});

// 2. OBTENIR TOUS LES LABYRINTHES (VUE GLOBALE)
ipcMain.handle('get-all-labyrinths', async () => {
    return new Promise((resolve) => {
        db.all("SELECT id, user_id, name, difficulty, size FROM labyrinths", [], (err, rows) => {
            if (err) {
                console.error("Erreur SQLite Admin Labyrinths:", err);
                resolve([]);
            } else {
                resolve(rows || []);
            }
        });
    });
});

// 3. ADMIN : SUPPRIMER UN UTILISATEUR
ipcMain.handle('delete-user', async (event, userId) => {
    return new Promise((resolve) => {
        db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
            if (err) {
                console.error("Erreur SQLite Admin Delete User:", err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
});

// 4. ADMIN : SUPPRIMER UN LABYRINTHE
ipcMain.handle('delete-labyrinth', async (event, labId) => {
    return new Promise((resolve) => {
        db.run("DELETE FROM labyrinths WHERE id = ?", [labId], function(err) {
            if (err) {
                console.error("Erreur SQLite Admin Delete Lab:", err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
});