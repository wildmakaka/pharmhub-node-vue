const debounce = (func, delay) => {
  var timeout;
  return function() {
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

new Vue({
  el: '#app',
  data: {
    isProductLoading: false,
    product: null,
    shop: null,
    shops: null
  },
  methods: {
    onSKUInput: debounce(function(event) {
      this.isProductLoading = true;
      this.request('GET', `/ui/${this.shop.id}/${event.target.value}`, xhr => {
        this.isProductLoading = false;
        this.product = xhr.response;
      });
    }, 250),

    request(method, url, onLoad, data) {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', event => onLoad(event.target));
      xhr.open(method, url);
      xhr.setRequestHeader('Authorization', 'test');
      xhr.send(data);
    },

    showShop(shop) {
      this.product = null;
      this.shop = shop;
    }
  },

  created() {
    this.request('GET', '/ui', xhr => {
      this.shops = xhr.response;
    });
  }
});
