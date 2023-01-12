let tool = document.getElementById('tool');
if (tool) {
    profile.addEventListener('mouseover', () => {
        boxProfile.style.display = 'block'
    })
    boxProfile.addEventListener('mouseleave', () => {
        setTimeout(() => {
            boxProfile.style.display = 'none'
        }, 1500)
    })
}

let login = document.getElementsByClassName('login-btn');
for (let i = 0; i < login.length; i++) {
    login[i].addEventListener('click', () => {
        window.location.href = '/login'
    })
}
let allSugest = document.getElementById('allSugest');
let backSugest = document.getElementById('backSugest');
let allFollow = document.getElementById('allFollow');
let backFollow = document.getElementById('backFollow');

if (allSugest) {
    allSugest.addEventListener('click', () => {
        acountSugest.style['max-height'] = 'max-content';
        allSugest.style.display = 'none';
        backSugest.style.display = 'block';
    })
}
if (backSugest) {
    backSugest.addEventListener('click', () => {
        acountSugest.style['max-height'] = '350px';
        backSugest.style.display = 'none';
        allSugest.style.display = 'block';
    })
}

if (allFollow) {
    allFollow.addEventListener('click', () => {
        followingAcount.style['max-height'] = 'max-content';
        allFollow.style.display = 'none';
        backFollow.style.display = 'block';
    })
}

if (backFollow) {
    backFollow.addEventListener('click', () => {
        followingAcount.style['max-height'] = '350px';
        backFollow.style.display = 'none';
        allFollow.style.display = 'block';
    })
}
function Follow() {
    let btnFollow = document.getElementsByClassName('btn-follow');
    for (let i = 0; i < btnFollow.length; i++) {
        btnFollow[i].addEventListener('click', () => {
            let userFollow = btnFollow[i].classList[0].slice(4);
            let userFollower = btnFollow[i].classList[1].slice(4);
            let data = {
                follow: userFollow,
                follower: userFollower
            }
            fetch('/api/v1/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(async (res) => {
                    let mes = await res.json();
                    if (mes.message == 'Create successfully') {
                        // for (let j = 0; j < btnFollow.length; j++) {
                        //     if (btnFollow[i].classList[1].slice(4) == btnFollow[j].classList[1].slice(4)) {
                        //         btnFollow[j].innerHTML = '<h4>Đang Follow</h4>'
                        //         btnFollow[j].classList.add('cancel-follow');
                        //         btnFollow[j].classList.remove('btn-follow');
                        //     }
                        // }
                        // cancelFollow();
                        location.reload()
                    }
                })
                .catch((err) => {
                    alert(err);
                })

        })
    }
}

function cancelFollow() {
    let cancelFollow = document.getElementsByClassName('cancel-follow');
    for (let i = 0; i < cancelFollow.length; i++) {
        cancelFollow[i].addEventListener('click', () => {
            let userFollow = cancelFollow[i].classList[0].slice(4);
            let userFollower = cancelFollow[i].classList[1].slice(4);
            let data = {
                follow: userFollow,
                follower: userFollower
            }
            fetch(`/api/v1/follow/${userFollow}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(async (res) => {
                    let mes = await res.json();
                    if (mes.message == 'Delete successfully') {
                        // for (let j = 0; j < cancelFollow.length; j++) {
                        //     if (cancelFollow[i].classList[1].slice(4) == cancelFollow[j].classList[1].slice(4)) {
                        //         cancelFollow[j].innerHTML = '<h4>Follow</h4>'
                        //         cancelFollow[j].classList.add('btn-follow');
                        //         cancelFollow[j].classList.remove('cancel-follow');
                        //     }
                        // }
                        // Follow()
                        location.reload()
                    }
                })
                .catch((err) => {
                    alert(err);
                })
        })
    }
}
Follow();
cancelFollow();

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

let btnLike = document.getElementsByClassName('btn-like');
for (let i = 0; i < btnLike.length; i++) {
    btnLike[i].addEventListener('click', () => {
        if (btnLike[i].style.color == 'white' || btnLike[i].style.color == "") {
            btnLike[i].style.color = 'crimson';
            let data = {
                user_id: +(btnLike[i].classList[1].slice(4)),
                blog_id: +(btnLike[i].classList[2].slice(4))
            }
            fetch('/api/v1/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(async (res) => {
                    let mes = await res.json();
                    if (mes.message == 'Like successfully') {
                        location.reload()
                    }
                })
        } else {
            btnLike[i].style.color = 'white';
            let data = {
                user_id: +(btnLike[i].classList[1].slice(4)),
                blog_id: +(btnLike[i].classList[2].slice(4))
            }
            fetch('/api/v1/dislike', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(async (res) => {
                    let mes = await res.json();
                    if (mes.message == 'Delete successfully') {
                        location.reload()
                    }
                })
        }
    })
}

logout.addEventListener('click', () => {
    fetch('/api/v1/logout')
        .then(async (res) => {
            let mes = await res.json();
            if (mes.message == 'Logout successfully') {
                window.location.href = '/';
            }
        })
})


fetch('/api/v1/search')
    .then(async (res) => {
        let data = await res.json();
        console.log(data);
        inputSearch.addEventListener('input', () => {
            
        })
    })



