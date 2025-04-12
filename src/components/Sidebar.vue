<template>
    <aside class="w-64 bg-white shadow h-screen p-4 flex flex-col">
        <ul class="flex-1">
            <!-- Admin Role -->
            <li v-if="role === 'admin'">
                <!-- Dashboard Link with exact matching -->
                <router-link 
                    to="/dashboard" 
                    class="block p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out" 
                    exact-active-class="bg-red-500 text-white rounded-lg">Dashboard</router-link>
                <router-link 
                    to="/dashboard/mahasiswa" 
                    class="block p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out" 
                    active-class="bg-red-500 text-white rounded-lg">Mahasiswa</router-link>
                <router-link 
                    to="/dashboard/dosen" 
                    class="block p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out" 
                    active-class="bg-red-500 text-white rounded-lg">Dosen</router-link>
                <router-link 
                    to="/dashboard/matakuliah" 
                    class="block p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out" 
                    active-class="bg-red-500 text-white rounded-lg">Mata Kuliah</router-link>
            </li>

            <!-- Mahasiswa Role -->
            <li v-else-if="role === 'mahasiswa'">
                <!-- Dashboard Link with exact matching -->
                <router-link 
                    to="/dashboard" 
                    class="block p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out" 
                    exact-active-class="bg-red-500 text-white rounded-lg">Dashboard</router-link>
                <router-link 
                    to="/dashboard/ambil-matakuliah" 
                    class="block p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out" 
                    active-class="bg-red-500 text-white rounded-lg">Ambil Mata Kuliah</router-link>
            </li>
        </ul>
    </aside>
</template>

<script setup>
defineProps({
    role: String
})
</script>

<style scoped>
/* Optional: Add custom styles to ensure the sidebar fits the entire screen */
aside {
  height: 100vh; /* Make sure the sidebar takes full height of the screen */
}
</style>
