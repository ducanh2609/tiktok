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

// Get message
let userReceive;
let userSend = document.getElementsByClassName('message-box')[0].classList[1].slice(4);
let username = document.getElementsByClassName('username');
for (let i = 0; i < username.length; i++) {
    username[i].addEventListener('click', () => {
        for (let j = 0; j < username.length; j++) {
            username[j].style['background-color'] = 'rgb(24, 26, 27)';
        }
        username[i].style['background-color'] = 'rgb(70, 69, 69)';
        userReceive = +username[i].classList[1].slice(4);
        let messageBox = document.getElementById('messageBox');
        messageBox.classList.remove(messageBox.classList[2]);
        messageBox.classList.add(`chat${userReceive}`);
        sendForm.style.visibility = 'visible';
        fetch(`/api/v1/chat/${userSend}/${userReceive}`)
            .then(async (data) => {
                let messBox = await data.json();
                let imageSend = messBox.image.find((item) => item.user_id == userSend);
                let imageReceive = messBox.image.find((item) => item.user_id == userReceive);
                if (!messBox.chat[0]) {
                    messageBox.innerHTML = `
                    <div style="text-align: center;height: 60px;line-height: 30px;display: block; ">
                        Bạn chưa có tin nhắn nào với người này. <br> Hãy là người nhắn tin đầu tiên
                    </div>
                    `
                } else {
                    messageBox.innerHTML = '';
                    for (let j = 0; j < messBox.chat.length; j++) {
                        if (messBox.chat[j].userchat_id == userReceive) {
                            messageBox.innerHTML += `
                                <div class="message-point user-receive ">
                                    <img src="${imageReceive.image}" alt="">
                                    <div>
                                        ${messBox.chat[j].chat_content}
                                        <div class="time">${messBox.chat[j].time}</div>
                                    </div>
                                </div>
                                `

                        } else {
                            messageBox.innerHTML += `
                                <div class="message-point user-send">
                                    <div>
                                    ${messBox.chat[j].chat_content}
                                    <div class="time">${messBox.chat[j].time}</div>
                                    </div>
                                    <img src="${imageSend.image}" alt="">
                                </div>
                                `
                        }
                    }
                }
                messageBox.scrollTop = messageBox.scrollHeight;

            })
    })
}

// Socket realtime
var socket = io();
socket.on("connect", () => {
    console.log('connected');
});
socket.on('chat', (data) => {
    addMessage(data[0])
});

function addMessage(chat) {
    if (messageBox.classList[2]) {
        let userChating = +(messageBox.classList[2]).slice(4);
        if (userChating == userReceive) {
            if (chat.userchat_id == userReceive) {
                messageBox.innerHTML += `
                <div class="message-point user-receive ">
                    <img src="${chat.imageReceive}" alt="">
                    <div>
                        ${chat.chat_content}
                        <div class="time">${chat.time}</div>
                    </div>
                </div>
                `

            } else {
                messageBox.innerHTML += `
                <div class="message-point user-send">
                    <div>
                    ${chat.chat_content}
                    <div class="time">${chat.time}</div>
                    </div>
                    <img src="${chat.imageSend}" alt="">
                </div>
                `
            }
        }
        messageBox.scrollTop = messageBox.scrollHeight;
    }
}

// Send message
sendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let data = {
        userSend: +userSend,
        userReceive: userReceive,
        content: sendForm.inputMess.value
    }
    console.log(data);
    fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
            'COntent-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(async (res) => {
            let mes = await res.json();
            if (mes.message == 'Chat successfully') {
                sendForm.inputMess.value = '';
            }
        })
        .catch((err) => {
            alert(err);
        })
})



// HIện thông báo
message.addEventListener('click', () => {
    if (messageBox.style.display == 'none' || messageBox.style.display == '') {
        messageBox.style.display = 'block';
    } else {
        messageBox.style.display = 'none';
    }
})