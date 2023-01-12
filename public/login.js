let icon = document.getElementsByClassName('fa-regular');
let pass = document.getElementsByClassName('password');
for (let i = 0; i < icon.length; i++) {
    icon[i].addEventListener('click', () => {
        if (icon[i].classList.contains('fa-eye')) {
            icon[i].classList.add('fa-eye-slash');
            icon[i].classList.remove('fa-eye');
            console.log(pass[i].type);
            pass[i].type = 'text';
        } else {
            icon[i].classList.remove('fa-eye-slash');
            icon[i].classList.add('fa-eye');
            console.log(pass[i].type);
            pass[i].type = 'password';
        }
    })
}
cancel.addEventListener('click', () => {
    window.location.href = '/'
})


let loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let data = {
        username: loginForm.username.value,
        password: loginForm.password.value
    }
    if (!(data.username !== '' && data.password !== '')) {
        err.style.display = 'block';
    } else {
        err.style.display = 'none';
        fetch('/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(async (res) => {
                let mes = await res.json();
                if (mes.message == "Acount doesn't exists") {
                    alert(mes.message)
                } else {
                    let token = mes.message;
                    const d = new Date();
                    d.setTime(d.getTime() + (90 * 24 * 60 * 60 * 1000));
                    let expires = "expires=" + d.toUTCString();
                    document.cookie = 'username' + "=" + token + ";" + expires + ";path=/";
                    window.location.href = '/';
                }
            })
    }
})