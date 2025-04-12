import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import MahasiswaView from '@/views/MahasiswaView.vue'
import DosenView from '@/views/DosenView.vue'
import MataKuliahView from '@/views/MataKuliahView.vue'
import AmbilMataKuliahView from '@/views/AmbilMataKuliahView.vue'
import Login from '@/views/Login.vue'
import DashboardHome from '@/views/DashboardHome.vue'

const routes = [
  { path: '/', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', component: DashboardHome },
      { path: 'mahasiswa', component: MahasiswaView },
      { path: 'dosen', component: DosenView },
      { path: 'matakuliah', component: MataKuliahView },
      { path: 'ambil-matakuliah', component: AmbilMataKuliahView },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
