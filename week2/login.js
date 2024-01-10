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
            const path = 'haru'; // 加入個人 API Path
            
            axios
            .post(`${url}/admin/signin`, this.user)
            .then((res) => {
                const { token, expired } = res.data; // 取出 token(登入驗證), expired(時間戳記)
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`; // 將取出來的 token, expired 存到 cookie
                window.location = 'products.html'; // 跳轉頁面至 products.html
            })
            .catch((err) => {
                alert(err.response.data.message);
            });
        },
    },
}).mount('#app');
