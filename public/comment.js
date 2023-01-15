
link.value = window.location.href;



let btnFollow = document.getElementsByClassName('follow');
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
                                allFollowElement[i].innerHTML = ` <h4>Đang Follow</h4>`
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

// Sao chép liên kết
copyLink.addEventListener('click', () => {
    let link = document.getElementById('link');
    let input = document.createElement('input');
    document.body.appendChild(input);
    input.value = link.value;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
})

// Socket realtime
let blog = +(sendForm.classList[1].slice(4));

var socket = io();
socket.on("connect", () => {
    console.log('connected');
});
socket.on('comment', (data) => {
    addMessage(data, blog)
});

function addMessage(comment, blog) {
    if (comment[0].blog_id == blog) {
        let result = `
        <div class="comment-part">
            <div class="user-cmt-image">
                <img src="${comment[0].image}" alt="">
            </div>
            <div class="user-cmt-profile">
                <div class="username">
                    <h3>
                        ${comment[0].tiktok_id}
                    </h3>
                </div>
                <div class="content" style="font-size: 14px;">
                    ${comment[0].content}
                </div>
                <div class="time" style="font-size: 12px; color: rgb(113, 115, 116);">
                    ${comment[0].time}
                </div>
            </div>
            <div class="btn-like">
                <i class="fa-solid fa-ellipsis" style="display: none;"></i> <br>
                <i class="fa-regular fa-heart"></i>
            </div>
        </div>
        `
        commentContent.innerHTML += result;
        commentContent.scrollTop = commentContent.scrollHeight;

    }
}
// function getMessages(blog) {
//     fetch('/socket')
//         .then(async (res) => {
//             let data = await res.json();
//             addMessage(data, blog);
//             // socket.emit('comment', data)
//         })
// }

// Gửi comment
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
                // getMessages(blog);
                let firtComment = document.getElementById('firtComment');
                if (firtComment) {
                    firtComment.style.display = 'none';
                }
                sendForm.content.value = '';
            }
        })
        .catch((err) => {
            alert(err);
        })
})


// Show-hide emoji chat
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


// Chuyển trang comment

let pageLeft = document.getElementsByClassName('page-left');
let totalBlog = +pageLeft[0].classList[1].slice(9);
let blogID = window.location.href.slice(30);
let index = blogID.search('/');
let end = blogID.slice(index);

if (blogID.includes('userlike')) {
    blogID = +blogID.slice(0, index);
    down.addEventListener('click', () => {
        window.location.href = `/comment/${blogID + 1}${end}`;
    })
    up.addEventListener('click', () => {
        window.location.href = `/comment/${blogID - 1}${end}`;
    })
} else if (blogID.includes('home')) {
    blogID = +blogID.slice(0, index);
    down.addEventListener('click', () => {
        window.location.href = `/comment/${blogID + 1}${end}`;
    })
    up.addEventListener('click', () => {
        window.location.href = `/comment/${blogID - 1}${end}`;
    })
}


// Show-hide up-down
if (blogID > 1) {
    up.style.display = 'block';
}
if (blogID == totalBlog) {
    down.style.display = 'none';
}


// Đóng comment và chuyển về trang trước

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

// Đưa scroll comment về cuối
commentContent.scrollTop = commentContent.scrollHeight;