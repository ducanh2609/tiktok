let icon = document.getElementsByClassName('fa-regular');
let pass = document.getElementsByClassName('password');
for (let i = 0; i < icon.length; i++) {
    icon[i].addEventListener('click', () => {
        if (icon[i].classList.contains('fa-eye')) {
            icon[i].classList.add('fa-eye-slash');
            icon[i].classList.remove('fa-eye');
            pass[i].type = 'text';
        } else {
            icon[i].classList.remove('fa-eye-slash');
            icon[i].classList.add('fa-eye');
            pass[i].type = 'password';
        }
    })
}


cancel.addEventListener('click', () => {
    window.location.href = '/login'
})
let signinForm = document.getElementById('signinForm');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let data = {
        username: signinForm.username.value,
        email: signinForm.email.value,
        password: signinForm.password.value,
        confirmPass: signinForm.confirmPass.value
    }
    if (!(data.username !== '' && data.email !== '' && data.password !== '' && data.confirmPass == data.password)) {
        err.style.display = 'block';
    } else {
        err.style.display = 'none';
        fetch('/api/v1/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(async (res) => {
                let mes = await res.json();
                alert(mes.message);
                if (mes.message == 'Acount create successfully') {
                    window.location.href = '/login'
                }
            })
            .catch((err) => {
                alert(err);
            })
    }
})