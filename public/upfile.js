btnUpload.addEventListener('click', () => {
    inputUpload.click();
})
let imgBlog;
inputUpload.addEventListener('change', async () => {
    if (player.src != '') {
        var desertRef = firebase.storage().refFromURL(player.src)
        desertRef.delete().then(() => {
            console.log('ok');
        }).catch((error) => {
            console.log(error);
        });
    }
    let file = inputUpload.files[0];
    let url1 = window.URL.createObjectURL(inputUpload.files[0])
    // set loading
    box1.style.display = 'none';
    preview.style.display = 'none';
    box2.style.display = 'block';
    player.src = '';
    imgScreen.innerHTML = '';
    var uploadTask = firebase.storage().ref()
        .child('test')
        .child(file.name)
        .put(file);
    uploadTask.on('state_changed',
        (snapshot) => {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            loading.innerText = progress.toFixed(1);
            loadingRange.value = progress.toFixed(1);
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            console.log(error);
            // Handle unsuccessful uploads
        },
        async () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                let url = downloadURL;
                // clear loading
                preview.style.display = 'block';
                box2.style.display = 'none';
                player.src = url;
                fileName.innerText = file.name;
                send.disabled = false;
            });
            showImageAt(0, url1);
        }
    );
})
function getVideoImage(path, secs, callback) {
    var me = this, video = document.createElement('video');
    video.onloadedmetadata = function () {
        if ('function' === typeof secs) {
            secs = secs(this.duration);
        }
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
    };
    video.onseeked = function (e) {
        var canvas = document.createElement('canvas');
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = new Image();
        img.crossOrigin = "anonymous"
        img.src = canvas.toDataURL();
        callback.call(me, img, this.currentTime, e);
    };
    video.onerror = function (e) {
        callback.call(me, undefined, undefined, e);
    };
    video.src = path;
}

function showImageAt(secs, url) {
    // var duration;
    getVideoImage(
        `${url}`,
        function (totalTime) {
            duration = totalTime;
            return secs;
        },
        function (img, secs, event) {
            if (event.type == 'seeked') {
                var div = document.createElement('div');
                div.appendChild(img);
                document.getElementById('imgScreen').appendChild(div);
                if (++secs < 6) {
                    showImageAt(secs, url);
                } else {
                    let screen = document.querySelectorAll('.image-screen div');
                    let imgPart = document.querySelectorAll('.image-screen div img')
                    for (let i = 0; i < screen.length; i++) {
                        screen[i].addEventListener('click', () => {
                            for (let j = 0; j < screen.length; j++) {
                                screen[j].classList.remove('image-click');
                            }
                            screen[i].classList.add('image-click');
                            imgBlog = imgPart[i].src;
                            // console.log(imgBlog);
                        })
                    }
                };
            }
        }
    );


}

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

cancel.addEventListener('click', () => {
    var desertRef = firebase.storage().refFromURL(player.src)
    desertRef.delete().then(() => {
        console.log('ok');
    }).catch((error) => {
        console.log(error);
    });
    preview.style.display = 'none';
    box1.style.display = 'block';
    statusInput.value = '';
    charInput.innerText = 0;
    player.src = "";
    imgScreen.innerHTML = '';

})
profile.addEventListener('mouseover', () => {
    boxProfile.style.display = 'block'
})
boxProfile.addEventListener('mouseleave', () => {
    setTimeout(() => {
        boxProfile.style.display = 'none'
    }, 1500)
})
send.addEventListener('submit', (e) => {
    e.preventDefault();
    let content = document.getElementsByClassName('content');
    let user_id = content[0].classList[1].slice(4);
    let fileName = new Date().getTime();
    let uploadTask = firebase.storage().ref()
        .child('test')
        .child(`test${fileName}`)
        .put(imgBlog);
    uploadTask.on('state_changed',
        (snapshot) => {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            loading.innerText = progress.toFixed(1);
            loadingRange.value = progress.toFixed(1);
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            console.log(error);
            // Handle unsuccessful uploads
        },
        async () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                let url = downloadURL;
                let data = {
                    user_id: user_id,
                    url: player.src,
                    status: send.status.value,
                    image_blog: url,
                    like: 0,
                    share: 0,
                    provide: send.provide.value,
                    comment: send.comment.checked,
                    duet: send.duet.checked,
                    stitch: send.stitch.checked
                }
                if (data.url.indexOf('localhost:3000') != -1) {
                    alert('Hãy chọn 1 video để đăng lên');
                } else {
                    fetch('/api/v1/blog', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })
                        .then(async (res) => {
                            let mes = await res.json();
                            alert(`${mes.message}`);
                            if (mes.message == 'Create successfully') {
                                window.location.href = "/";
                            }
                        })
                }
            });
        }
    );
})
statusInput.addEventListener('input', () => {
    charInput.innerText = statusInput.value.length;
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

btnChange.addEventListener(('click'), () => {
    inputUpload.click();
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