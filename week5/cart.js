const { createApp } = Vue;

// 引用 VeeValidate
const { Form, Field, ErrorMessage, defineRule, configure } = VeeValidate;

// 定義驗證規則
const { email, required, min, max } = VeeValidateRules;
defineRule('email', email);
defineRule('required', required);
defineRule('min', min);
defineRule('max', max);

// 改成繁體中文
const { loadLocaleFromURL, localize } = VeeValidateI18n;
loadLocaleFromURL(
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
);
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true,
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'haru';

let userProductModal = null;

const app = createApp({
  data(){
    return{
      products:[],
      tempProduct: { // 預期 modal 開啟時，帶入的資料
        imagesUrl: [], // 預先定義，避免出錯（可以情況決定要不要寫）
      }, 
      status:{
        addToCartLoading:'',
        cartQtyLoading:'',
      },
      qty:1,
      carts:{},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    }
  },
  watch: {
    tempProduct(){
      this.qty = 1;
    }
  },
  methods: {
    getProducts(){
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
      })
    },
    openModal(products){
      this.tempProduct = products;
      this.userProductModal.show();
    },
    addToCart(product_id,qty = 1){  // 參數預設值
      const order = {   // 從 api文件 中把 api 會回傳的資料貼上
        product_id,
        qty
      };
      this.status.addToCartLoading = product_id;  // 加入購物車的時候帶入 product_id
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data: order }) // data參數
        .then((res) => {
        this.status.addToCartLoading = '';  // 加入完成後清掉
        this.getCart(); // 每加入購物車，重新取出購物車列表
        this.userProductModal.hide();
      })
    },
    getCart(){
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          console.log(res);
          this.carts = res.data.data;
      })
    },
    changeCart(item,qty = 1){  // 可參考 addToCart()
      const order = { 
        product_id:item.product_id,
        qty,
      };
      this.status.cartQtyLoading = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data: order }) // data參數
        .then((res) => {
          this.status.cartQtyLoading = '';
          this.getCart(); // 重新取出購物車列表
      })
    },
    removeItem(id){
      this.status.cartQtyLoading = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`) // data參數
        .then((res) => {
          this.status.cartQtyLoading = '';
          this.getCart(); // 重新取出購物車列表
      });
    },
    createOrder(){
      const order = this.form;
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, {data: order}) // data參數
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm(); // 清除表單欄位
          this.getCart(); 
        })
        .catch((err)=>{
          alert(err.response.data.message);
        });
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
    this.userProductModal =  new bootstrap.Modal(this.$refs.userProductModal)
  },
});

app.component('VForm',VeeValidate.Form);
app.component('VField',VeeValidate.Field);
app.component('ErrorMessage',VeeValidate.ErrorMessage);
app.mount('#app');