<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar :user="user" @logout="logout" />

    <div class="flex flex-1">
      <Sidebar :role="user?.role" />

      <div class="flex-1 p-4">
        <router-view v-slot="{ Component }">
          <component :is="Component" :role="user?.role" />
        </router-view>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const user = ref(null)
const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/')
    return
  }

  try {
    const res = await axios.get('http://localhost:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    user.value = res.data
  } catch (err) {
    localStorage.removeItem('token')
    router.push('/')
  }
})

const logout = async () => {
  const token = localStorage.getItem('token')
  try {
    await axios.post('http://localhost:8000/api/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch { }
  localStorage.removeItem('token')
  router.push('/')
}
</script>
