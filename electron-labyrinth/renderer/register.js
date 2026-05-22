const btn = document.getElementById('registerBtn');

btn.addEventListener('click', async () => {

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    const result =
        await window.electronAPI.register({

            username,
            password
        });

    if(result.success) {

        alert('Compte créé');

        window.location.href =
            'login.html';

    } else {

        alert(result.error);
    }
});