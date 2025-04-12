<template>
    <div class="p-6 bg-gradient-to-br from-white to-gray-100 min-h-screen">
        <div class="bg-white shadow rounded-2xl p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Selamat Datang di Dashboard</h2>
            <p class="text-gray-600 mb-6">
                Halo, <span class="font-medium capitalize">{{ role }}</span>.
                Silakan gunakan menu di samping untuk mengakses fitur yang tersedia.
            </p>

            <div v-if="role !== 'admin' && role !== 'mahasiswa'">
                <p class="text-red-500">Role tidak dikenali.</p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

// Props dari parent (Dashboard layout)
defineProps({
    role: String
})

</script>