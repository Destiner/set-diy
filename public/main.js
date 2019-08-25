import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';

import Main from './views/Main.vue';

Vue.use(VueRouter);

const routes = [
	{ path: '/', component: Main }
];

const router = new VueRouter({
	mode: 'history',
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
	el: '#app'
});
