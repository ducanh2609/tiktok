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


let btnFollow = document.getElementsByClassName('btn-follow');
for (let i = 0; i < btnFollow.length; i++) {
    follow(btnFollow[i], btnFollow)
}
function follow(follow, allFollowElement) {
    follow.addEventListener('click', () => {
        let userFollow = follow.classList[0].slice(4);
        let userFollower = follow.classList[1].slice(4);
        let data = {
            follow: userFollow,
            follower: userFollower
        }
        if (follow.style['background-color'] == 'rgb(24, 26, 27)') {
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
                        for (let i = 0; i < allFollowElement.length; i++) {
                            if (allFollowElement[i].classList[1].slice(4) == userFollower) {
                                allFollowElement[i].style['background-color'] = 'crimson'
                                allFollowElement[i].innerHTML = ` <h4>??ang Follow</h4>`
                            }
                        }
                    }
                })
                .catch((err) => {
                    alert(err);
                })
        } else {
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
                        for (let i = 0; i < allFollowElement.length; i++) {
                            if (allFollowElement[i].classList[1].slice(4) == userFollower) {
                                allFollowElement[i].style['background-color'] = 'rgb(24, 26, 27)'
                                allFollowElement[i].innerHTML = ` <h4>Follow</h4>`
                            }
                        }
                    }
                })
                .catch((err) => {
                    alert(err);
                })
        }

    })
}

// ?????i m??u n???n
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



// Like
let btnLike = document.getElementsByClassName('btn-like');
let likePoint = document.getElementsByClassName('like-point');
for (let i = 0; i < btnLike.length; i++) {
    btnLike[i].addEventListener('click', () => {
        if (btnLike[i].style.color == 'white' || btnLike[i].style.color == "") {
            btnLike[i].style.color = 'crimson';
            console.log(btnLike[i].classList);
            let data = {
                user_id: +(btnLike[i].classList[1].slice(4)),
                blog_id: +(btnLike[i].classList[2].slice(5))
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
                        likePoint[i].innerText = +(likePoint[i].innerText) + 1;
                    }
                })
        } else {
            btnLike[i].style.color = 'white';
            let data = {
                user_id: +(btnLike[i].classList[1].slice(4)),
                blog_id: +(btnLike[i].classList[2].slice(5))
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
                        likePoint[i].innerText = +(likePoint[i].innerText) - 1;
                    }
                })
        }
    })
}


// ????ng xu???t
logout.addEventListener('click', () => {
    fetch('/api/v1/logout')
        .then(async (res) => {
            let mes = await res.json();
            if (mes.message == 'Logout successfully') {
                window.location.href = '/';
            }
        })
})

// Search
fetch('/api/v1/search')
    .then(async (res) => {
        let userList = await res.json();
        inputSearch.addEventListener('input', () => {
            if (inputSearch.value == '') {
                searchBox.style.display = 'none';
            } else {
                searchBox.style.display = 'block';
            }
            let result = '';
            for (let i = 0; i < userList.data.length; i++) {
                if (userList.data[i].username.includes(inputSearch.value)) {
                    result += `
                    <div class="search-user">
                        <div class="search-image">
                            <img src="${userList.data[i].image}" alt="">
                        </div>
                        <div class="search-infor">
                            <div class="search-tiktokId"><h3>${userList.data[i].tiktok_id}</h3></div>
                            <div class="search-name" style="font-size: 14px;">${userList.data[i].name}</div>
                        </div>
                    </div>
                    `
                }
            }
            searchBox.innerHTML = result;
            let searchUser = document.querySelectorAll('.search-box> div');
            let searchTiktokId = document.getElementsByClassName('search-tiktokId');
            for (let i = 0; i < searchUser.length; i++) {
                searchUser[i].addEventListener('click', () => {
                    window.location.href = `/profile/@${searchTiktokId[i].innerText}`;
                    searchBox.style.display = 'none';
                    inputSearch.value = '';
                })
            }
        })
    })

let userAcount = document.getElementsByClassName('user-acount');
let username = document.getElementsByClassName('username');
for (let i = 0; i < userAcount.length; i++) {
    userAcount[i].addEventListener('click', () => {
        window.location.href = `/profile/@${username[i].innerText}`;
    })
}

// HI???n th??ng b??o
message.addEventListener('click', () => {
    if (messageBox.style.display == 'none' || messageBox.style.display == '') {
        messageBox.style.display = 'block';
    } else {
        messageBox.style.display = 'none';
    }
})

