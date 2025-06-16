import { createRouter, createWebHistory } from 'vue-router';
import Home from '../App.vue'; // Importation du composant Home
const routes = [
  { path: '/', component: Home },  // Page d'accueil
  // autres routes ici...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
