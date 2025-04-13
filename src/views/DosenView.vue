<template>
  <div class="p-6 bg-gradient-to-br from-white to-gray-100 min-h-screen">
    <div class="bg-white shadow rounded-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Daftar Dosen</h2>
        <button @click="openAddModal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Tambah Dosen
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>

      <table v-else class="min-w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 text-left">No</th>
            <th class="px-4 py-2 text-left">Nama</th>
            <th class="px-4 py-2 text-left">NIDN</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Alamat</th>
            <th class="px-4 py-2 text-left">No HP</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dosen, index) in paginatedData" :key="dosen.id">
            <td class="px-4 py-2 w-[40px]">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="px-4 py-2 w-[100px] whitespace-normal break-words">{{ dosen.nama }}</td>
            <td class="px-4 py-2 w-[100px] whitespace-normal break-all">{{ dosen.nidn }}</td>
            <td class="px-4 py-2 w-[150px] whitespace-normal break-all">{{ dosen.user.email }}</td>
            <td class="px-4 py-2 w-[100px] whitespace-normal break-words">{{ dosen.alamat }}</td>
            <td class="px-4 py-2 w-[85px] whitespace-normal break-all">{{ dosen.no_hp }}</td>
            <td class="px-4 py-2 w-[100px]">
              <button @click="openEditModal(dosen)" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button @click="deleteDosen(dosen.id)" class="text-red-500 hover:text-red-700 ml-4">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-start items-center space-x-4">
        <button @click="goToFirstPage" :disabled="currentPage === 1"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300">First</button>
        <button @click="prevPage" :disabled="currentPage === 1"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300">Prev</button>

        <div class="flex space-x-2">
          <button v-for="page in pageNumbers" :key="page" @click="goToPage(page)"
            :class="{ 'bg-blue-500 text-white': page === currentPage, 'bg-gray-200': page !== currentPage }"
            class="p-2 rounded">
            {{ page }}
          </button>
        </div>

        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300">Next</button>
        <button @click="goToLastPage" :disabled="currentPage === totalPages"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300">Last</button>
        <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">{{ isEdit ? 'Edit Dosen' : 'Tambah Dosen' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="block">Nama</label>
            <input v-model="form.nama" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">NIDN</label>
            <input v-model="form.nidn" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">Email</label>
            <input v-model="form.email" type="email" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">Alamat</label>
            <input v-model="form.alamat" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">No HP</label>
            <input v-model="form.no_hp" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="closeModal"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Batal</button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {{ isEdit ? 'Update' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()
const dosenList = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)

const form = ref({
  id: null,
  nama: '',
  nidn: '',
  email: '',
  alamat: '',
  no_hp: ''
})

const token = localStorage.getItem('token')

const fetchDosen = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/dosen', {
      headers: { Authorization: `Bearer ${token}` }
    })
    dosenList.value = res.data
  } catch (err) {
    toast.error('Gagal memuat data dosen.')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDosen)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return dosenList.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(dosenList.value.length / itemsPerPage))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++
const goToPage = (page) => currentPage.value = page
const goToFirstPage = () => currentPage.value = 1
const goToLastPage = () => currentPage.value = totalPages.value

const openAddModal = () => {
  isEdit.value = false
  form.value = { id: null, nama: '', nidn: '', email: '', alamat: '', no_hp: '' }
  showModal.value = true
}

const openEditModal = (dosen) => {
  isEdit.value = true
  form.value = {
    id: dosen.id,
    nama: dosen.nama,
    nidn: dosen.nidn,
    email: dosen.user.email,
    alamat: dosen.alamat,
    no_hp: dosen.no_hp
  }
  showModal.value = true
}

const closeModal = () => showModal.value = false

const submitForm = async () => {
  try {
    const payload = {
      nama: form.value.nama,
      nidn: form.value.nidn,
      email: form.value.email,
      alamat: form.value.alamat,
      no_hp: form.value.no_hp
    }

    if (isEdit.value) {
      await axios.put(`http://localhost:8000/api/dosen/${form.value.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Data dosen berhasil diperbarui.')
    } else {
      await axios.post('http://localhost:8000/api/dosen', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Data dosen berhasil ditambahkan.')
    }

    closeModal()
    fetchDosen()
  } catch (err) {
    if (err.response?.data?.errors) {
      Object.values(err.response.data.errors).flat().forEach(msg => toast.error(msg))
    } else {
      toast.error('Terjadi kesalahan saat mengirim data.')
    }
    console.error(err)
  }
}

const deleteDosen = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    try {
      await axios.delete(`http://localhost:8000/api/dosen/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Data dosen berhasil dihapus.')
      fetchDosen()
    } catch (err) {
      toast.error('Gagal menghapus data dosen.')
      console.error(err)
    }
  }
}
</script>
