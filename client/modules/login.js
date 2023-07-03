const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-button');
const loginForm = document.getElementById('login-form');

loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const payload = {
        email: emailInput.value,
        password: passwordInput.value,
    };

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const userRes = await response.json();

        if (response.ok) {
            localStorage.setItem('token', userRes.token);

            return window.location.assign('./groups.html');
        }

        if (!response.ok) {
            return alert('Wrong email or password');
        }
    } catch (error) {
        console.log(error);
    }
});
