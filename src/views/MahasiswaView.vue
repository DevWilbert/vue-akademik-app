<template>
  <div class="p-6 bg-gradient-to-br from-white to-gray-100 min-h-screen">
    <div class="bg-white shadow rounded-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Daftar Mahasiswa</h2>
        <button @click="openAddModal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Tambah Mahasiswa
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>

      <!-- Tabel Mahasiswa -->
      <table v-else class="min-w-full table-auto border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 text-left">No</th>
            <th class="px-4 py-2 text-left">Nama</th>
            <th class="px-4 py-2 text-left">NIM</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Alamat</th>
            <th class="px-4 py-2 text-left">No HP</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mahasiswa, index) in paginatedData" :key="mahasiswa.id">
            <td class="px-4 py-2 w-[40px]">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="px-4 py-2 w-[100px] whitespace-normal break-words">{{ mahasiswa.nama }}</td>
            <td class="px-4 py-2 w-[100px] whitespace-normal break-all">{{ mahasiswa.nim }}</td>
            <td class="px-4 py-2 w-[130px] whitespace-normal break-all">{{ mahasiswa.user.email }}</td>
            <td class="px-4 py-2 w-[100px] whitespace-normal break-words">{{ mahasiswa.alamat }}</td>
            <td class="px-4 py-2 w-[87px] whitespace-normal break-all">{{ mahasiswa.no_hp }}</td>
            <td class="px-4 py-2 w-[100px]">
              <button @click="openEditModal(mahasiswa)" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button @click="deleteMahasiswa(mahasiswa.id)" class="text-red-500 hover:text-red-700 ml-4">
                <i class="fas fa-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-start items-center space-x-4">
        <!-- First Button -->
        <button @click="goToFirstPage" :disabled="currentPage === 1"
          class="bg-blue-500 text-white p-2 rounded flex items-center space-x-2 hover:bg-blue-600 disabled:bg-gray-300">
          <i class="fas fa-chevron-left"></i>
          <span>First</span>
        </button>

        <!-- Prev Button -->
        <button @click="prevPage" :disabled="currentPage === 1"
          class="bg-blue-500 text-white p-2 rounded flex items-center space-x-2 hover:bg-blue-600 disabled:bg-gray-300">
          <i class="fas fa-chevron-left"></i>
          <span>Prev</span>
        </button>

        <!-- Page Numbers -->
        <div class="flex space-x-2">
          <button v-for="page in pageNumbers" :key="page" @click="goToPage(page)"
            :class="{ 'bg-blue-500 text-white': page === currentPage, 'bg-gray-200 text-gray-600': page !== currentPage }"
            class="p-2 rounded hover:bg-blue-400 flex items-center justify-center">
            {{ page }}
          </button>
        </div>

        <!-- Next Button -->
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="bg-blue-500 text-white p-2 rounded flex items-center space-x-2 hover:bg-blue-600 disabled:bg-gray-300">
          <span>Next</span>
          <i class="fas fa-chevron-right"></i>
        </button>

        <!-- Last Button -->
        <button @click="goToLastPage" :disabled="currentPage === totalPages"
          class="bg-blue-500 text-white p-2 rounded flex items-center space-x-2 hover:bg-blue-600 disabled:bg-gray-300">
          <span>Last</span>
          <i class="fas fa-chevron-right"></i>
        </button>

        <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
      </div>

    </div>

    <!-- Modal Form Tambah/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 class="text-xl font-semibold mb-4">{{ isEdit ? 'Edit Mahasiswa' : 'Tambah Mahasiswa' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="block">Nama</label>
            <input v-model="form.nama" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">NIM</label>
            <input v-model="form.nim" type="text" class="w-full border px-3 py-2 rounded" required />
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

const mahasiswaList = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const isLoading = ref(false)

const showModal = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  nama: '',
  nim: '',
  email: '',
  alamat: '',
  no_hp: ''
})

const token = localStorage.getItem('token')

const fetchMahasiswa = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/mahasiswa', {
      headers: { Authorization: `Bearer ${token}` }
    })
    mahasiswaList.value = res.data
  } catch (error) {
    toast.error('Gagal memuat data mahasiswa.')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchMahasiswa)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return mahasiswaList.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(mahasiswaList.value.length / itemsPerPage))

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

const goToFirstPage = () => {
  currentPage.value = 1
}

const goToLastPage = () => {
  currentPage.value = totalPages.value
}

const openAddModal = () => {
  isEdit.value = false
  form.value = { id: null, nama: '', nim: '', email: '', alamat: '', no_hp: '' }
  showModal.value = true
}

const openEditModal = (mahasiswa) => {
  isEdit.value = true
  form.value = {
    id: mahasiswa.id,
    nama: mahasiswa.nama,
    nim: mahasiswa.nim,
    email: mahasiswa.user.email,
    alamat: mahasiswa.alamat,
    no_hp: mahasiswa.no_hp
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:8000/api/mahasiswa/${form.value.id}`, {
        nama: form.value.nama,
        nim: form.value.nim,
        email: form.value.email,
        alamat: form.value.alamat,
        no_hp: form.value.no_hp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Data mahasiswa berhasil diperbarui.')
    } else {
      await axios.post('http://localhost:8000/api/mahasiswa', {
        nama: form.value.nama,
        nim: form.value.nim,
        email: form.value.email,
        alamat: form.value.alamat,
        no_hp: form.value.no_hp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Data mahasiswa berhasil ditambahkan.')
    }
    closeModal()
    fetchMahasiswa()
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      const errors = err.response.data.errors
      Object.values(errors).forEach((errorArr) => {
        errorArr.forEach((msg) => toast.error(msg))
      })
    } else {
      toast.error('Terjadi kesalahan saat mengirim data.')
    }
    console.error('Error submitting form:', err)
  }
}

const deleteMahasiswa = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    try {
      await axios.delete(`http://localhost:8000/api/mahasiswa/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Data mahasiswa berhasil dihapus.')
      fetchMahasiswa()
    } catch (err) {
      toast.error('Gagal menghapus data mahasiswa.')
      console.error(err)
    }
  }
}
</script>
