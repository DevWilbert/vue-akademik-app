<template>
  <div class="p-6 bg-gradient-to-br from-white to-gray-100 min-h-screen">
    <div class="bg-white shadow rounded-2xl p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Daftar Mata Kuliah</h2>
        <button @click="openAddModal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Tambah Mata Kuliah
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>

      <table v-else class="min-w-full table-auto border-collapse text-sm">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 text-left">Kode</th>
            <th class="px-4 py-2 text-left">Nama</th>
            <th class="px-4 py-2 text-left">SKS</th>
            <th class="px-4 py-2 text-left">Semester</th>
            <th class="px-4 py-2 text-left">Dosen</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(matakuliah, index) in paginatedData" :key="matakuliah.id">
            <td class="px-4 py-2 border">{{ matakuliah.kode_matakuliah }}</td>
            <td class="px-4 py-2 border">{{ matakuliah.nama }}</td>
            <td class="px-4 py-2 border">{{ matakuliah.sks }}</td>
            <td class="px-4 py-2 border">{{ matakuliah.semester }}</td>
            <td class="px-4 py-2 border">{{ matakuliah.dosen.nama }}</td>
            <td class="px-4 py-2 border">
              <button @click="openEditModal(matakuliah)" class="text-blue-500 hover:text-blue-700">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button @click="deleteMatakuliah(matakuliah.id)" class="text-red-500 hover:text-red-700 ml-4">
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
        <h3 class="text-xl font-semibold mb-4">{{ isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <label class="block">Kode Mata Kuliah</label>
            <input v-model="form.kode_matakuliah" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">Nama Mata Kuliah</label>
            <input v-model="form.nama" type="text" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">SKS</label>
            <input v-model="form.sks" type="number" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">Semester</label>
            <input v-model="form.semester" type="number" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div class="mb-3">
            <label class="block">Dosen</label>
            <multiselect v-model="form.dosen_id" :options="dosenList" :custom-label="dosen => dosen.nama" track-by="id"
              placeholder="Pilih dosen" :searchable="true" :close-on-select="true" :allow-empty="false" label="nama"
              class="w-full" />
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
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

const toast = useToast()
const matakuliahList = ref([])
const dosenList = ref([])
const currentPage = ref(1)
const itemsPerPage = 10
const showModal = ref(false)
const isEdit = ref(false)
const isLoading = ref(false)

const form = ref({
  id: null,
  kode_matakuliah: '',
  nama: '',
  sks: '',
  semester: '',
  dosen_id: ''
})

const token = localStorage.getItem('token')

const fetchDosen = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/dosen', {
      headers: { Authorization: `Bearer ${token}` }
    })
    dosenList.value = res.data
  } catch (err) {
    toast.error('Gagal memuat data dosen.')
    console.error(err)
  }
}

const fetchMatakuliah = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/matakuliah', {
      headers: { Authorization: `Bearer ${token}` }
    })
    matakuliahList.value = res.data
  } catch (err) {
    toast.error('Gagal memuat data mata kuliah.')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMatakuliah()
  fetchDosen()
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return matakuliahList.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(matakuliahList.value.length / itemsPerPage))
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++
const goToPage = (page) => currentPage.value = page
const goToFirstPage = () => currentPage.value = 1
const goToLastPage = () => currentPage.value = totalPages.value

const openAddModal = () => {
  isEdit.value = false
  form.value = { id: null, kode_matakuliah: '', nama: '', sks: '', semester: '', dosen_id: '' }
  showModal.value = true
}

const openEditModal = (matakuliah) => {
  isEdit.value = true
  const selectedDosen = dosenList.value.find(d => d.id === matakuliah.dosen_id)
  form.value = {
    id: matakuliah.id,
    kode_matakuliah: matakuliah.kode_matakuliah,
    nama: matakuliah.nama,
    sks: matakuliah.sks,
    semester: matakuliah.semester,
    dosen_id: selectedDosen || matakuliah.dosen_id
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  try {
    const url = isEdit.value
      ? `http://localhost:8000/api/matakuliah/${form.value.id}`
      : 'http://localhost:8000/api/matakuliah'

    const method = isEdit.value ? 'put' : 'post'

    const dataToSend = {
      ...form.value,
      dosen_id: typeof form.value.dosen_id === 'object' ? form.value.dosen_id.id : form.value.dosen_id
    }

    await axios({
      method,
      url,
      data: dataToSend,
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success(isEdit.value ? 'Mata kuliah berhasil diperbarui' : 'Mata kuliah berhasil ditambahkan')
    fetchMatakuliah()
    closeModal()
  } catch (err) {
    if (err.response?.data?.errors) {
      Object.values(err.response.data.errors).flat().forEach(msg => toast.error(msg))
    } else {
      toast.error('Terjadi kesalahan saat mengirim data.')
    }
  }
}

const deleteMatakuliah = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
    try {
      await axios.delete(`http://localhost:8000/api/matakuliah/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Mata kuliah berhasil dihapus.')
      fetchMatakuliah()
    } catch (err) {
      toast.error('Gagal menghapus mata kuliah.')
      console.error(err)
    }
  }
}
</script>
