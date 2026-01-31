import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/consultar-todos',
    name: 'consultarTodos',
    component: () => import(/* webpackChunkName: "consultarTodos" */ '../views/ConsultarTodosView.vue')
  },
  {
    path: '/consultar-id',
    name: 'consultarID',
    component: () => import(/* webpackChunkName: "consultarID" */ '../views/ConsultarIDView.vue')
  },
  {
    path: '/guardar',
    name: 'guardar',
    component: () => import(/* webpackChunkName: "guardar" */ '../views/GuardarView.vue')
  },
  {
    path: '/actualizar',
    name: 'actualizar',
    component: () => import(/* webpackChunkName: "actualizar" */ '../views/ActualizarView.vue')
  },
  {
    path: '/actualizar-parcial',
    name: 'actualizarParcial',
    component: () => import(/* webpackChunkName: "actualizarParcial" */ '../views/ActualizarParcialView.vue')
  },
  {
    path: '/eliminar',
    name: 'eliminar',
    component: () => import(/* webpackChunkName: "eliminar" */ '../views/EliminarView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});

export default router
