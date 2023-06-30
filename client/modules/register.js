const fullNameInput = document.getElementById('full-name-input');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const repeatPasswordInput = document.getElementById('repeat-password');
const registerBtn = document.getElementById('register-button');

registerBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (passwordInput.value != repeatPasswordInput.value) {
        return alert('Check password input. Repeat password does not match password');
    }

    const payload = {
        full_name: fullNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
    };

    try {
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const body = await response.json();

        console.log(body.token);

        if (body.error) {
            console.error(body.error);
        }
        localStorage.setItem('token', body.token);
        window.location.href = './login.html';
    } catch (error) {
        console.log(error);
    }
});
