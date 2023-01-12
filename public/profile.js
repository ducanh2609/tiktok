profile.addEventListener('mouseover', () => {
    boxProfile.style.display = 'block'
})
boxProfile.addEventListener('mouseleave', () => {
    setTimeout(() => {
        boxProfile.style.display = 'none'
    }, 1500)
})
let btnChange = document.getElementById('btnChange');
let cancel = document.getElementById('cancel');
let btnSave = document.getElementById('btnSave');

if (btnChange && cancel && btnSave) {
    btnChange.addEventListener('click', () => {
        changeMotal.style.display = 'block';
        changeBackground.style.display = 'block';
        charInput.innerText = storyInput.value.length;
    })
    let cancel = [iconClose, btnCancel];
    for (let i = 0; i < cancel.length; i++) {
        cancel[i].addEventListener('click', () => {
            changeMotal.style.display = 'none';
            changeBackground.style.display = 'none';
        })
    }
    let arr = [imageChange, idInput, nameInput, storyInput];
    for (let i = 0; i < arr.length; i++) {
        arr[i].addEventListener('input', () => {
            idChange.innerText = idInput.value;
            btnSave.disabled = false;
            btnSave.style['background-color'] = 'rgba(255,59,92,1)';
            btnSave.style['color'] = 'white';

        })
    }
    btnSave.addEventListener('click', () => {
        // console.log(SQLUsername.href.slice(30));
        let data = {
            image: imageChange.src,
            tiktokid: idInput.value,
            name: nameInput.value,
            story: storyInput.value
        }
        fetch(`/profile/${SQLUsername.href.slice(30)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(async (res) => {
                let mess = await res.json();
                alert(mess.message);
                if (mess.message == 'Update successfully') {
                    window.location.href = `/profile/@${mess.href}`;
                }
            })
    })
}
storyInput.addEventListener('input', () => {
    charInput.innerText = storyInput.value.length;
})
changeClick.addEventListener('click', () => {
    btnImageChange.click();
})
btnImageChange.addEventListener('change', async () => {
    let file = btnImageChange.files[0];
    // set loading
    imageChange.src = '/Image/Reload-1s-200px.svg';
    loadingBar.style.display = 'block';
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
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                loadingBar.style.display = 'none';
                imageChange.src = downloadURL;
            });
        }
    );
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
videoVideo.style['border-bottom'] = '3px solid white';
videoVideo.addEventListener('click', () => {
    videoVideo.style['border-bottom'] = '3px solid white';
    videoLike.style['border-bottom'] = '2px solid rgb(45, 44, 44)';
    contentVideo.style.visibility = 'visible';
    contentLike.style.visibility = 'hidden';
})
videoLike.addEventListener('click', () => {
    videoLike.style['border-bottom'] = '3px solid white';
    videoVideo.style['border-bottom'] = '2px solid rgb(45, 44, 44)';
    contentVideo.style.visibility = 'hidden';
    contentLike.style.visibility = 'visible';
})
let video = document.getElementsByClassName('video-path');
let videoLiker = document.getElementsByClassName('video-path-like');
for (let i = 0; i < video.length; i++) {
    video[i].addEventListener('click', () => {
        let blog_id = video[i].classList[1].slice(4);
        let sub = video[i].classList[2].slice(3);
        window.location.href = `/comment/${blog_id}/userlike-${sub}`;
    })
}
for (let i = 0; i < videoLiker.length; i++) {
    videoLiker[i].addEventListener('click', () => {
        let blog_id = videoLiker[i].classList[1].slice(8);
        let subLike = vidvideoLikereo[i].classList[2].slice(7);
        window.location.href = `/comment/${blog_id}/userlike-${subLike}`;
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