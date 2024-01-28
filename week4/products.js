import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup(){
    
    const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
    const apiPath = 'haru';
    
    const products = ref([]); // 存放產品資料 空陣列
    const status = ref(false); // 分辨是 新增 or 編輯，以便 API 判斷
    const isNew = ref(false); // 分辨是 新增 or 編輯，以便 API 判斷
    const tempProduct = ref({ // 預期 modal 開啟時，帶入的資料
      imagesUrl: [], // 預先定義，避免出錯（可以情況決定要不要寫）
    });
    
  
  
    // 1 確認是否登入
    const checkAdmin = () => {
        axios
        .post(`${apiUrl}/api/user/check`)
        .then((res) => {
          // alert('登入驗證成功！')
          getProducts();  // 成功就取得產品資訊
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = 'login.html'; // 錯誤跳回登入頁面
        });
    };

    // 2 取得產品資訊
    const getProducts = () => {
      axios
      .get(`${apiUrl}/api/${apiPath}/admin/products/all`)
      .then((res) => {
        products.value = res.data.products;
      })
      .catch((err) => {
        alert(err.data.message);
      })
    };
    
    // 3 open modal
    const openModel = (isNew, item) => {  // status: 分辨 new, edit, delete ; item: 分辨帶入資料
      if( isNew === 'new' ){
        tempProduct.value = {
          imagesUrl: [],
        }; // 先清空 -> 預期 modal 開啟時，帶入的資料
        status.value = true;
        productModal.show();
      } else if( isNew === 'edit' ){
        tempProduct.value = { ...item };
        status.value = false;
        productModal.show();
      } else if ( isNew === 'delete' ){
        // tempProduct.value = { ...item };  // X
        tempProduct.value = item ;  // O 修改：不用修改內容，所以不用淺拷貝
        delProductModal.show();
      }
    };

    // 4 確定新增 btn -> 新增產品傳進API
    const updateProduct = () => {
      let url = `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`;
      let http = 'put';

      if(status.value){
        url = `${apiUrl}/api/${apiPath}/admin/product`;
        http = 'post';
      }

      axios[http](url, { data: tempProduct.value })  // axios[http] = axios.post 括弧記法：用在 特殊字元 或 帶入變數。
      .then((res) => {
        alert(res.data.message);
        productModal.hide();
        getProducts();  // 取得所有產品函式
      })
      .catch((err) => {
        alert(err.data.message);
      })
    };

    // 5 確定刪除 btn -> 刪除產品
    const delProduct = () => {
      let url = `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`;

      axios.delete(url)
      .then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        getProducts();
      })
      .catch((err) => {
        alert(err.data.message);
      })
    };

    // 6 新增圖片
    const createImages = () => {
      tempProduct.value.imagesUrl = []; // 避免在編輯產品時，沒有 imagesUrl 屬性去執行的話，接下來的 push 會出錯
      tempProduct.value.imagesUrl.push('');  // 新增空的 input，讓使用者填寫圖片網址
    };
  
  
    // 1 取得 Token
    // 從 cookie 裡取得 Token（Token 僅需要設定一次）
    onMounted(() => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      // 下次進到這個網站，會將 Ｔoken 裡的資料傳給 cookie，就不需要再回傳驗證一次
      axios.defaults.headers.common.Authorization = token; 
      
      checkAdmin();

      // 2 建立 Modal 實體：open
      productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
        keyboard: false,      // 禁止用 esc 關閉視窗
        backdrop: 'static'    // 禁止點空白處關閉視窗
      });
  
      // 3 建立 Modal 實體：delete
      delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
        keyboard: false,      // 禁止用 esc 關閉視窗
        backdrop: 'static'    // 禁止點空白處關閉視窗
      });
    });


    return{
      products,
      status,
      tempProduct,
      openModel,
      updateProduct,
      delProduct,
      createImages,
      isNew,
    };
  },
});

app.mount('#app');