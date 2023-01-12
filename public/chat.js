profile.addEventListener('mouseover', () => {
    boxProfile.style.display = 'block'
})
boxProfile.addEventListener('mouseleave', () => {
    setTimeout(() => {
        boxProfile.style.display = 'none'
    }, 1500)
})

let body = document.querySelector('body');
switchBar.addEventListener('change', () => {
    if (body.style['background-color'] == 'rgb(24, 26, 27)' || body.style['background-color'] == '') {
        body.style['background-color'] = 'white'
        body.style.color = 'black'
    } else {
        body.style['background-color'] = 'rgb(24, 26, 27)'
        body.style.color = 'white'
    }
})

logout.addEventListener('click', () => {
    fetch('/api/v1/logout')
        .then(async (res) => {
            let mes = await res.json();
            if (mes.message == 'Logout successfully') {
                window.location.href = '/';
            }
        })
})  