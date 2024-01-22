const { createApp } = Vue;

let productModal = null;

const app = createApp({
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
            // alert('登入驗證成功！')
            this.getProducts();  // 成功就取得產品資訊
        })
        .catch((err) => {
            alert(err.data.message);
            window.location = 'login.html'; // 錯誤跳回登入頁面
        })
    },

    // 2 取得產品資訊
    getProducts(){
        axios
        .get(`${this.url}/api/${this.path}/admin/products`)
          .then((res) => {
            this.products = res.data.products;
          })
          .catch((err) => {
            alert(err.data.message);
          })
    },
    
    // 3 產品詳細資訊
    selectItem(item){
    this.productDetail = item ;
    },

    // 4 open modal
    openModel(){
      productModal.show();
    },

    // 5 新增產品
    addItem(){
    },

    // 6 刪除產品
    removeItem(){

    },

    // 7 編輯產品
    confirmEdit(){

    },
  },
  mounted(){
      // 1 取得 Token
      // 從 cookie 裡取得 Token（Token 僅需要設定一次）
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      // 下次進到這個網站，會將 Ｔoken 裡的資料傳給 cookie，就不需要再回傳驗證一次
      axios.defaults.headers.common.Authorization = token; 
      this.checkAdmin();

      // 2 建立 Modal 實體
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,      // 禁止用 esc 關閉視窗
        backdrop: 'static'    // 禁止點空白處關閉視窗
      })
  }
});
app.mount('#app');