// 1. Vérification stricte de sécurité au chargement de la page
const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.role !== 'admin') {
    alert('Accès refusé : Réservé aux administrateurs.');
    window.location.href = 'login.html';
}

// Affichage de la session actuelle
document.getElementById('stats').innerText = `Connecté en tant que ${user.username}`;

// 2. Chargement dynamique des données depuis la base SQLite via IPC
window.addEventListener('DOMContentLoaded', async () => {
    await chargerUtilisateurs();
    await chargerLabyrinthes();
});

// --- FONCTION : CHARGER ET AFFICHER LES UTILISATEURS ---
async function chargerUtilisateurs() {
    const tbody = document.getElementById('usersTable').querySelector('tbody');
    tbody.innerHTML = ''; 

    try {
        // Utilisation de window.electronAPI
        const dataUsers = await window.electronAPI.invoke('get-all-users'); 
        
        dataUsers.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 8px;">${u.id}</td>
                <td style="padding: 8px;">${u.username}</td>
                <td style="padding: 8px;"><span class="badge">${u.role}</span></td>
                <td style="padding: 8px;">
                    ${u.id !== user.id ? `<button onclick="supprimerUtilisateur(${u.id})" style="background-color: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">❌ Supprimer</button>` : '<em style="color: gray;">(Vous-même)</em>'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        tbody.innerHTML = `<tr><td colspan="4" style="color: red; padding: 8px;">Erreur de liaison IPC (Vérifier main.js)</td></tr>`;
    }
}

// --- FONCTION : CHARGER ET AFFICHER TOUS LES LABYRINTHES ---
async function chargerLabyrinthes() {
    const tbody = document.getElementById('labTable').querySelector('tbody');
    tbody.innerHTML = '';

    try {
        // Utilisation de window.electronAPI
        const dataLabs = await window.electronAPI.invoke('get-all-labyrinths');

        if (dataLabs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="padding: 8px; text-align: center;">Aucun labyrinthe en base de données.</td></tr>`;
            return;
        }

        dataLabs.forEach(lab => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 8px;">${lab.id}</td>
                <td style="padding: 8px;">${lab.user_id}</td>
                <td style="padding: 8px;">${lab.name}</td>
                <td style="padding: 8px;">${lab.difficulty}</td>
                <td style="padding: 8px;">${lab.size || 'N/A'}</td>
                <td style="padding: 8px;">
                    <button onclick="supprimerLabyrinthe(${lab.id})" style="background-color: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">🗑️ Supprimer</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des labyrinthes :", error);
        tbody.innerHTML = `<tr><td colspan="6" style="color: red; padding: 8px;">Erreur de liaison IPC (Vérifier main.js)</td></tr>`;
    }
}

// --- ACTIONS DE SUPPRESSION ---

window.supprimerUtilisateur = async (idSuppr) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ID ${idSuppr} ?`)) {
        try {
            const reussite = await window.electronAPI.invoke('delete-user', idSuppr);
            if (reussite) {
                alert('Utilisateur supprimé avec succès.');
                await chargerUtilisateurs(); 
                await chargerLabyrinthes();  
            }
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    }
};

window.supprimerLabyrinthe = async (idLab) => {
    if (confirm(`Supprimer définitivement le labyrinthe ID ${idLab} ?`)) {
        try {
            const reussite = await window.electronAPI.invoke('delete-labyrinth', idLab);
            if (reussite) {
                alert('Labyrinthe supprimé.');
                await chargerLabyrinthes(); 
            }
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    }
};