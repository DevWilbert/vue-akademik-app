<template>
    <div class="p-6 bg-gradient-to-br from-white to-gray-100 min-h-screen">
        <div class="bg-white shadow rounded-2xl p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Daftar Mahasiswa - Mata Kuliah - Dosen</h2>
                <button @click="showModal = true" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Edit
                </button>
            </div>

            <!-- Loading Spinner -->
            <div v-if="isLoading" class="flex justify-center py-10">
                <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>

            <!-- Tabel -->
            <table v-else class="min-w-full table-auto border-collapse text-sm">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="px-4 py-2 text-left border">No</th>
                        <th class="px-4 py-2 text-left border">Nama Mahasiswa</th>
                        <th class="px-4 py-2 text-left border">Mata Kuliah Yang Diambil</th>
                        <th class="px-4 py-2 text-left border">Dosen Pengampu</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in paginatedData" :key="index" class="hover:bg-gray-50">
                        <td class="px-4 py-2 border">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                        <td class="px-4 py-2 border">{{ row.nama_mahasiswa }}</td>
                        <td class="px-4 py-2 border">{{ row.nama_mk }}</td>
                        <td class="px-4 py-2 border">{{ row.dosen }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="mt-4 flex flex-wrap justify-start items-center space-x-2">
                <button @click="goToFirstPage" :disabled="currentPage === 1"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    First
                </button>

                <button @click="prevPage" :disabled="currentPage === 1"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Prev
                </button>

                <div class="flex space-x-1">
                    <button v-for="page in pageNumbers" :key="page" @click="goToPage(page)" :class="{
                        'bg-blue-500 text-white': page === currentPage,
                        'bg-gray-200 text-gray-800': page !== currentPage
                    }" class="px-3 py-1 rounded">
                        {{ page }}
                    </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Next
                </button>

                <button @click="goToLastPage" :disabled="currentPage === totalPages"
                    class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Last
                </button>

                <span class="ml-4 text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 class="text-lg font-semibold mb-4">Pilih Mahasiswa</h3>
                <multiselect v-model="selectedMahasiswa" :options="daftarMahasiswa"
                    :custom-label="mahasiswa => mahasiswa.nama" track-by="id" placeholder="Pilih Mahasiswa"
                    :searchable="true" :close-on-select="true" :allow-empty="false" label="nama" class="w-full" />
                <div class="flex justify-end gap-2 mt-2">
                    <!-- <button @click="goToDetail" class="bg-green-500 text-white px-4 py-2 rounded">Go</button> -->
                    <router-link v-if="selectedMahasiswa && selectedMahasiswa.id"
                        :to="'/dashboard/mahasiswa-matakuliah/' + selectedMahasiswa.id"
                        class="bg-green-500 text-white px-4 py-2 rounded inline-block text-center">
                        Go
                    </router-link>


                    <button @click="showModal = false" class="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const data = ref([])
const currentPage = ref(1)
const perPage = 10
const isLoading = ref(false)
const token = localStorage.getItem('token')
const showModal = ref(false)
const daftarMahasiswa = ref([])
const selectedMahasiswa = ref({})
const toast = useToast()

const fetchData = async () => {
    isLoading.value = true
    try {
        const res = await axios.get('http://localhost:8000/api/admin/mahasiswa-mata-kuliah', {
            headers: { Authorization: `Bearer ${token}` }
        })
        data.value = res.data
    } catch (err) {
        console.error('Gagal mengambil data:', err)
    } finally {
        isLoading.value = false
    }

    try {
        const res = await axios.get('http://localhost:8000/api/mahasiswa', {
            headers: { Authorization: `Bearer ${token}` }
        })
        daftarMahasiswa.value = res.data
    } catch (err) {
        console.error('Gagal mengambil data mahasiswa:', err)
    }
}

onMounted(fetchData)

// const goToDetail = () => {
//     console.log(selectedMahasiswa.value)
//     if (!selectedMahasiswa.value || !selectedMahasiswa.value.id) {
//         return toast.error('Isi Field')
//     }

//     const mahasiswaId = selectedMahasiswa.value.id

//     router.push({
//         name: 'MahasiswaMataKuliahDetail',
//         params: { id: mahasiswaId },
//         state: { mahasiswa: selectedMahasiswa.value },
//     })

// }

const flattenedData = computed(() => {
    const result = []
    data.value.forEach((mhs) => {
        if (mhs.mata_kuliah.length > 0) {
            mhs.mata_kuliah.forEach((mk) => {
                result.push({
                    nama_mahasiswa: mhs.nama_mahasiswa,
                    nama_mk: mk.nama_mk,
                    dosen: mk.dosen
                })
            })
        } else {
            result.push({
                nama_mahasiswa: mhs.nama_mahasiswa,
                nama_mk: 'Belum mengambil mata kuliah',
                dosen: '-'
            })
        }
    })
    return result
})

const totalPages = computed(() => Math.ceil(flattenedData.value.length / perPage))

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return flattenedData.value.slice(start, start + perPage)
})

const pageNumbers = computed(() => {
    const pages = []
    for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
    }
    return pages
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const goToFirstPage = () => {
    currentPage.value = 1
}

const goToLastPage = () => {
    currentPage.value = totalPages.value
}
</script>