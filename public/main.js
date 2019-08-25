import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';

import Main from './views/Main.vue';
import Set from './views/Set.vue';

Vue.use(VueRouter);

const routes = [
	{ path: '/', component: Main },
	{ path: '/set/:address', component: Set },
];

const router = new VueRouter({
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
	el: '#app'
});
