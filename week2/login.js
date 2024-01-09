import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data(){
        return{
            user :{
                username: '',
                password: '',
            },
        }
    },
    methods:{
        login(){
            const url = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點
                         
            const path = 'haru'; // 請加入個人 API Path
            
            axios.post(`${url}/admin/signin`, this.user)
            .then((res) => {
                const { token, expired } = res.data; // 取出 token, expired
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`; // 將取出來的 token, expired 存到 cookie
                window.location = 'products.html'; // 跳轉頁面至 products.html
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
        },
    },
}).mount('#app');



// const emailInput = document.querySelector('#username');
// const pwInput = document.querySelector('#password');
// const loginBtn = document.querySelector('#loginBtn');

// loginBtn.addEventListener('click', login);

