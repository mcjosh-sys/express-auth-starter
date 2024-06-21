const loginEndpoint = 'http://localhost:3380/login';
const loginForm = document.getElementById('login-form');
loginForm?.addEventListener('submit', handleLogin);
function handleLogin(e) {
    e.preventDefault();
    const loginFormData = new FormData(loginForm);
    const loginFormObject = Object.fromEntries(loginFormData);
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(loginFormObject)
    };

    fetch(loginEndpoint, options)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .catch((err) => {
            console.log({ err: err.message });
        });
}
