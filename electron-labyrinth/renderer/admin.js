const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.role !== 'admin') {
    alert('Accès refusé');
    window.location.href = 'login.html';
}

document.getElementById('stats').innerText =
    `Connecté en tant que ${user.username}`;

// Tableau utilisateurs
const usersTable = document.getElementById('usersTable');

usersTable.innerHTML = `
<tr>
    <th>ID</th>
    <th>Nom</th>
    <th>Rôle</th>
</tr>
<tr>
    <td>${user.id}</td>
    <td>${user.username}</td>
    <td>${user.role}</td>
</tr>
`;

// Tableau labyrinthes
const labTable = document.getElementById('labTable');

labTable.innerHTML = `
<tr>
    <th>ID</th>
    <th>Nom</th>
    <th>Difficulté</th>
</tr>
<tr>
    <td>1</td>
    <td>Premier Labyrinthe</td>
    <td>5</td>
</tr>
`;