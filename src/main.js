import Vue from 'vue';
import VueRouter from 'vue-router'
import App from './App.vue';
import { BootstrapVue } from 'bootstrap-vue';
import './app.scss';

import AddressFormPostcodeLookup from './components/AddressFormPostcodeLookup';
import AddressFormAutocomplete from './components/AddressFormAutocomplete.vue';

Vue.use(VueRouter)
Vue.use(BootstrapVue);

const routes = [
    { path: '/postcode-lookup', component: AddressFormPostcodeLookup },
    { path: '/autocomplete', component: AddressFormAutocomplete }
]

const router = new VueRouter({
    routes 
})

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App)
}).$mount('#app');
