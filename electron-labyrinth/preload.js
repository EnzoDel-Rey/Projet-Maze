const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    register: (data) => ipcRenderer.invoke('register', data),
    login: (data) => ipcRenderer.invoke('login', data),
    saveMaze: (data) => ipcRenderer.invoke('save-maze', data),
    getMazes: (userId) => ipcRenderer.invoke('get-mazes', userId),
    updateMaze: (data) => ipcRenderer.invoke('update-maze', data),
    deleteMaze: (id) => ipcRenderer.invoke('delete-maze', id),
    
    // 🛠️ AJOUT CRITIQUE : Permet à l'admin d'appeler dynamiquement les requêtes SQL
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
});