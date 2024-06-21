const registerEndpoint = 'http://localhost:3380/register';
const registerForm = document.getElementById('register-form');
registerForm?.addEventListener('submit', handleRegister);
function handleRegister(e) {
    e.preventDefault();
    const registerFormData = new FormData(registerForm);
    const registerFormObject = Object.fromEntries(registerFormData);
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(registerFormObject)
    };

    fetch(registerEndpoint, options)
        .then((res) => {
            if (res.status === 409) {
                res.json().then(({msg}) => alert(msg));
            }
            if (res.ok) {
                alert('account created successfully');
                window.location.replace('/login');
            }
        })
        .catch((err) => {
            console.log({ err: err.message });
        });
}
