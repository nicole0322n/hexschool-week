const { createApp } = Vue;

let productModal = null;
let delProductModal = null;

const app = createApp({
  data(){
    return{
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'haru',
      products: [], // 存放產品資料 空陣列
      isNew: false, // 分辨是 新增 or 編輯，以便 API 判斷
      tempProduct:{ // 預期 modal 開啟時，帶入的資料
        imagesUrl: [], // 預先定義，避免出錯（可以情況決定要不要寫）
      }, 
    }
  },
  methods:{
    // 1 確認是否登入
    checkAdmin(){
        axios
        .post(`${this.apiUrl}/api/user/check`)
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
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products/all`)
          .then((res) => {
            this.products = res.data.products;
          })
          .catch((err) => {
            alert(err.data.message);
          })
    },
    
    // 3 open modal
    openModel(isNew, item){  // status: 分辨 new, edit, delete ; item: 分辨帶入資料
      if( isNew === 'new' ){
        this.tempProduct = {
          imagesUrl: [],
        }; // 先清空 -> 預期 modal 開啟時，帶入的資料
        this.isNew = true;
        productModal.show();
      } else if( isNew === 'edit' ){
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if ( isNew === 'delete' ){
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },

    // 4 確定新增 btn -> 新增產品傳進API
    updateProduct(){
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      let http = 'put';

      if(this.isNew){
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        http = 'post';
      }

      axios[http](url, { data:this.tempProduct })  // axios[http] = axios.post 括弧記法：用在 特殊字元 或 帶入變數。
      .then((res) => {
        alert(res.data.message);
        productModal.hide();
        this.getProducts();  // 取得所有產品函式
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },

    // 5 確定刪除 btn -> 刪除產品
    delProduct(){
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
      .then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        this.getProducts();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    },

    // 6 新增圖片
    createImages(){
      this.tempProduct.imagesUrl = []; // 避免在編輯產品時，沒有 imagesUrl 屬性去執行的話，接下來的 push 會出錯
      this.tempProduct.imagesUrl.push('');  // 新增空的 input，讓使用者填寫圖片網址
    }
  },
  mounted(){
      // 1 取得 Token
      // 從 cookie 裡取得 Token（Token 僅需要設定一次）
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      // 下次進到這個網站，會將 Ｔoken 裡的資料傳給 cookie，就不需要再回傳驗證一次
      axios.defaults.headers.common.Authorization = token; 
      this.checkAdmin();

      // 2 建立 Modal 實體：open
      productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
        keyboard: false,      // 禁止用 esc 關閉視窗
        backdrop: 'static'    // 禁止點空白處關閉視窗
      });

      // 3 建立 Modal 實體：delete
      delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
        keyboard: false,      // 禁止用 esc 關閉視窗
        backdrop: 'static'    // 禁止點空白處關閉視窗
      })
  }
});
app.mount('#app');