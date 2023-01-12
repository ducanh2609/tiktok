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