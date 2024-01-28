import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
 
createApp({
    setup(){
        const user = ref({
            username: '',
            password: '',
        });
    
    
        // 按下登入，axios 驗證 帳密資料 -> 確認無誤跳轉至商品頁面
        const login = () => {
            const url = 'https://vue3-course-api.hexschool.io/v2'; // 加入站點         
            const path = 'haru'; // 加入個人 API Path
            
            axios
            .post(`${url}/admin/signin`, user.value)
            .then((res) => {
                const { token, expired } = res.data; // 取出 token(登入驗證), expired(時間戳記)
                document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`; // 將取出來的 token, expired 存到 cookie
                window.location = 'products.html'; // 跳轉頁面至 products.html
            })
            .catch((err) => {
                alert(err.data.message);
            });
        };

        return{
            user,
            login,
        };
    },
}).mount('#app');
