// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Beranda from '../pages/Beranda.vue'
import ProfilDesa from '../pages/ProfilDesa.vue'
import FormPendudukBaru from '../pages/FormPendudukBaru.vue'
import DataPenduduk from '../pages/DataPenduduk.vue'
import Galeri from '../pages/Galeri.vue'
import BeritaDesa from '../pages/Beritadesa.vue'  

const routes = [
  { path: '/',               name: 'Beranda',          component: Beranda },
  { path: '/profil',         name: 'ProfilDesa',       component: ProfilDesa },
  { path: '/penduduk/form',  name: 'FormPendudukBaru', component: FormPendudukBaru },
  { path: '/penduduk/data',  name: 'DataPenduduk',     component: DataPenduduk },
  { path: '/galeri',         name: 'Galeri',           component: Galeri },
  { path: '/berita-desa',    name: 'BeritaDesa',       component: BeritaDesa } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
