link.value = window.location.href;


function Follow() {
    let follow = document.getElementsByClassName('follow');
    for (let i = 0; i < follow.length; i++) {
        follow[i].addEventListener('click', () => {
            let userFollow = follow[i].classList[0].slice(4);
            let userFollower = follow[i].classList[1].slice(4);
            let blog = follow[i].classList[2].slice(4);
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
                        // for (let j = 0; j < follow.length; j++) {
                        //     if (follow[i].classList[1].slice(4) == follow[j].classList[1].slice(4)) {
                        //         follow[j].innerHTML = '<h4>Đang Follow</h4>'
                        //         follow[j].classList.add('cancel-follow');
                        //         follow[j].classList.remove('btn-follow');
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
            let blog = cancelFollow[i].classList[2].slice(4);
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

copyLink.addEventListener('click', () => {
    let link = document.getElementById('link');
    let input = document.createElement('input');
    document.body.appendChild(input);
    input.value = link.value;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
})

sendForm.addEventListener('submit', (e) => {
    let blog = +(sendForm.classList[1].slice(4));
    let user = +(sendForm.classList[2].slice(4));
    e.preventDefault();
    let data = {
        blog_id: blog,
        user_id: user,
        content: sendForm.content.value,
        like: 0
    }
    console.log(data);
    fetch('/api/v1/comment', {
        method: 'POST',
        headers: {
            'COntent-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(async (res) => {
            let mes = await res.json();
            if (mes.message == 'Comment successfully') {
                location.reload();
            }
        })
})

emoji.addEventListener('click', () => {
    if (emojiCode.style.visibility == 'hidden' || emojiCode.style.visibility == "") {
        emojiCode.style.visibility = 'visible';
    } else {
        emojiCode.style.visibility = 'hidden';
    }
})
let emojiChoise = document.getElementsByClassName('emoji-choise');
for (let i = 0; i < emojiChoise.length; i++) {
    emojiChoise[i].addEventListener('click', () => {
        commentInput.value += emojiChoise[i].innerText;
        emojiCode.style.visibility = 'hidden';
    })
}
let pageLeft = document.getElementsByClassName('page-left');
let totalBlog = +pageLeft[0].classList[1].slice(9);
let blogID = window.location.href.slice(30);
if (blogID.includes('userlike')) {
    blogID = +blogID.slice(-blogID.length, -9);
    down.addEventListener('click', () => {
        window.location.href = `/comment/${blogID + 1}/userlike`;
    })
    up.addEventListener('click', () => {
        window.location.href = `/comment/${blogID - 1}/userlike`;
    })
} else if (blogID.includes('home')) {
    blogID = +blogID.slice(-blogID.length, -5);
    down.addEventListener('click', () => {
        window.location.href = `/comment/${blogID + 1}/home`;
    })
    up.addEventListener('click', () => {
        window.location.href = `/comment/${blogID - 1}/home`;
    })
}
if (blogID > 1) {
    up.style.display = 'block';
}
if (blogID == totalBlog) {
    down.style.display = 'none';
}
let tiktokIdStr = window.location.href;
let userlikeIndex = tiktokIdStr.search('userlike-');
let tiktokId = tiktokIdStr.slice(userlikeIndex + 9);
btnClose.addEventListener('click', () => {
    if (window.location.href.includes('home')) {
        window.location.href = '/'
    } else if (window.location.href.includes('userlike')) {
        window.location.href = `/profile/@${tiktokId}`;
    }
})

// commentContent.scrollTop = commentContent.scrollHeight;