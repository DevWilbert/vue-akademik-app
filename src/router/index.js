import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import MahasiswaView from '@/views/MahasiswaView.vue'
import DosenView from '@/views/DosenView.vue'
import MataKuliahView from '@/views/MataKuliahView.vue'
import AmbilMataKuliahView from '@/views/AmbilMataKuliahView.vue'
import Login from '@/views/Login.vue'
import DashboardHome from '@/views/DashboardHome.vue'
import MahasiswaMataKuliahView from '@/views/MahasiswaMataKuliahView.vue'

const routes = [
  { path: '/', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      { path: '', component: DashboardHome },
      { path: 'mahasiswa', component: MahasiswaView, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'dosen', component: DosenView, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'matakuliah', component: MataKuliahView, meta: { requiresAuth: true, role: 'admin' } },
      { path: 'ambil-matakuliah', component: AmbilMataKuliahView, meta: { requiresAuth: true, role: 'mahasiswa' } },
      { path: 'mahasiswa-matakuliah', component: MahasiswaMataKuliahView, meta: { requiresAuth: true, role: 'admin' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard untuk memeriksa autentikasi dan role
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user')) // Ambil user dari localStorage
  const isAuthenticated = !!user
  const userRole = user?.role
  const token = localStorage.getItem('token')

  // Jika rute membutuhkan autentikasi dan user belum login, redirect ke login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/') // Redirect ke halaman login
  } else if (to.meta.role && to.meta.role !== userRole) {
    // Jika role tidak sesuai dengan yang diizinkan, redirect ke dashboard
    next('/dashboard')
  } else {
    next() // Lanjutkan ke rute yang diminta jika autentikasi dan role sesuai
  }
})

export default router
