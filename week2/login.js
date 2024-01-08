// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'haru'; // 請加入個人 API Path

const emailInput = document.querySelector('#username');
const pwInput = document.querySelector('#password');
const loginBtn = document.querySelector('#loginBtn');

loginBtn.addEventListener('click', login);

function login(){
    const username = emailInput.value;
    const password = pwInput.value;

    const user = {
        username,
        password
    };
    
    axios.post(`${url}/admin/signin`, user)
    .then((res)=>{
        console.log(res);
        const { token, expired } = res.data;
        console.log(token, expired);
        document.cookie = `haruToken=${token}; expires=${new Date(expired)};`; // 將取出來的 token, expired 存到 cookie
    })
    .catch((err)=>{
        console.log(err);
    })
}

