/* js */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import './assets/go'

/* css */
import "normalize.css";
import 'element-ui/lib/theme-chalk/index.css'

/* install */
Vue.use(ElementUI)

/* setting */
Vue.config.productionTip = false

/* init */
new Vue({
    render: h => h(App)
}).$mount('#app')