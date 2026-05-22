const btn = document.getElementById('loginBtn');

btn.addEventListener('click', async () => {

    const username =
        document.getElementById('username').value;

    const password =
        document.getElementById('password').value;

    const result =
        await window.electronAPI.login({

            username,
            password
        });

    if(result.success) {

        localStorage.setItem(
            'token',
            result.token
        );

        localStorage.setItem(
            'user',
            JSON.stringify(result.user)
        );

        if(result.user.role === 'admin') {

            window.location.href =
                'admin.html';

        } else {

            window.location.href =
                'dashboard.html';
        }

    } else {

        alert(result.error);
    }
});