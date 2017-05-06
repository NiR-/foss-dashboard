import Vue from 'vue';
import VueRouter from 'vue-router';
import * as components from './components';

Vue.use(VueRouter);

const router = new VueRouter({routes: [
  {name: 'dashboard', path: '/', component: components.Dashboard},
  {name: 'repo', path: '/:repo', component: components.RepoDetails}
]});

export default router;
