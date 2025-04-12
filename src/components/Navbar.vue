<template>
    <nav class="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
        <div class="text-lg font-semibold">Dashboard</div>
        <div>
            <span class="mr-4">{{ user?.email }} ({{ user?.role }})</span>
            <button @click="$emit('logout')" class="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
    </nav>
</template>

<script setup>
defineProps({
    user: Object
})
</script>