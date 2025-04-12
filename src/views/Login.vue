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
            class="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
            :disabled="isLoading"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
            <span>{{ isLoading ? 'Loading...' : 'Login' }}</span>
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const isLoading = ref(false)
  
  const handleLogin = async () => {
    isLoading.value = true
    error.value = ''
  
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email.value,
        password: password.value
      })
  
      const token = response.data.token
      localStorage.setItem('token', token)
  
      // Redirect setelah login berhasil
      window.location.href = '/dashboard'
    } catch (err) {
      error.value = 'Email atau password salah.'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  