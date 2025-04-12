<!-- src/components/Login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
  
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input
              type="email"
              v-model="email"
              class="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input
              type="password"
              v-model="password"
              class="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
  
          <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>
  
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
//   import { ref } from 'vue'
//   import axios from 'axios'
  
//   const email = ref('')
//   const password = ref('')
//   const error = ref('')
  
//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/login', {
//         email: email.value,
//         password: password.value
//       })
  
//       const token = response.data.token
  
//       // Simpan token, misalnya ke localStorage
//       localStorage.setItem('token', token)
  
//       // Redirect ke halaman utama (atau dashboard)
//       window.location.href = '/dashboard'
  
//     } catch (err) {
//       error.value = 'Email atau password salah.'
//     }
//   }
  </script>
  