import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/chartist';
import './plugins/base'
import axios from 'axios';
import moment from 'moment';

Vue.config.productionTip = false
axios.defaults.baseURL="http://localhost:3000/api";

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
});