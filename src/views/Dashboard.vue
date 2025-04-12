<!-- src/components/Dashboard.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-xl">
      <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
      <p class="mb-2"><strong>Email:</strong> {{ user?.email }}</p>
      <p class="mb-4"><strong>Role:</strong> {{ user?.role }}</p>

      <button
        @click="logout"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const user = ref(null)
const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/')
    return
  }

  try {
    const response = await axios.get('http://localhost:8000/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    user.value = response.data
  } catch (err) {
    localStorage.removeItem('token')
    router.push('/')
  }
})

const logout = async () => {
  const token = localStorage.getItem('token')

  try {
    await axios.post(
      'http://localhost:8000/api/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (err) {
    console.error('Logout error:', err)
  } finally {
    localStorage.removeItem('token')
    router.push('/')
  }
}
</script>
