import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    data(){
      return{
        url: 'https://vue3-course-api.hexschool.io/v2',
        path: 'haru',
        products: [], // 存放產品資料 空陣列
        productDetail:{}, // 暫存產品明細資料 空物件
      }
    },
    methods:{
        // 1 確認是否登入
        checkAdmin(){
            axios
            .post(`${this.url}/api/user/check`)
            .then((res) => {
                console.log('OK!!!')
                this.getProducts();  // 成功就取得產品資訊
            })
            .catch((err) => {
                alert(err.response.data.message);
                window.location = 'login.html'; // 錯誤跳回登入頁面
            })
        },

        // 2 取得產品資訊
        getProducts(){
            axios
            .get(`${this.url}/api/${this.path}/admin/products`)
              .then((response) => {
                this.products = response.data.products;
              })
              .catch((err) => {
                alert(err.response.data.message);
              })
        },
        selectItem(item){
        this.productDetail = item ;
      },
    },
    // mounted(){
    //     // 從 cookie 裡取得 Token（Token 僅需要設定一次）
    //     const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    //     // 下次進到這個網站，會將 Ｔoken 裡的資料傳給 cookie，就不需要再回傳驗證一次
    //     axios.defaults.headers.common.Authorization = token; 
    //     this.checkAdmin();
    // }
  }).mount('#app');