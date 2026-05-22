const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    register: (data) => ipcRenderer.invoke('register', data),
    login: (data) => ipcRenderer.invoke('login', data),
    saveMaze: (data) => ipcRenderer.invoke('save-maze', data),
    getMazes: (userId) => ipcRenderer.invoke('get-mazes', userId),
    updateMaze: (data) => ipcRenderer.invoke('update-maze', data), // Ajouté
    deleteMaze: (id) => ipcRenderer.invoke('delete-maze', id)
});