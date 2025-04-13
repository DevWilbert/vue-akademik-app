<template>
  <div class="min-h-screen bg-white p-6">
    <h1 class="text-xl font-semibold mb-4">Mata Kuliah yang Diambil</h1>

    <div v-if="loading" class="text-center">Loading...</div>

    <div v-else>
      <table class="min-w-full table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2 border">No</th>
            <th class="px-4 py-2 border">ID Mata Kuliah</th>
            <th class="px-4 py-2 border">Mata Kuliah</th>
            <th class="px-4 py-2 border">Dosen Pengajar</th>
            <th class="px-4 py-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in mataKuliahDiambil" :key="index">
            <td class="px-4 py-2 border">{{ index + 1 }}</td>
            <td class="px-4 py-2 border">{{ item.kode_mk}}</td>
            <td class="px-4 py-2 border">{{ item.nama_mk }}</td>
            <td class="px-4 py-2 border">{{ item.dosen }}</td>
            <td class="px-4 py-2 border">
              <button @click="removeMataKuliah(item.id_mata_kuliah)" class="bg-red-500 text-white px-4 py-2 rounded">
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <button @click="openModal" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Tambah Mata Kuliah
      </button>
    </div>

    <!-- Modal Tambah Mata Kuliah -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-md shadow-lg w-1/2">
        <h2 class="text-xl font-semibold mb-4">Pilih Mata Kuliah</h2>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div v-for="mataKuliah in daftarMataKuliah" :key="mataKuliah.id" class="flex items-center">
            <!-- Tampilkan checkbox dan nama mata kuliah dengan styling yang jelas -->
            <input type="checkbox" :value="mataKuliah.id" v-model="selectedMataKuliah" class="mr-2" />
            <span class="text-sm font-medium">{{ mataKuliah.nama_mk }}</span> <!-- Styling teks mata kuliah -->
          </div>
        </div>

        <div class="mt-4 flex justify-between">
          <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
            Batal
          </button>
          <button @click="saveMataKuliah" class="bg-blue-500 text-white px-4 py-2 rounded">
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import axios from 'axios'

const props = defineProps({
  user: Object
})

const mataKuliahDiambil = ref([])
const daftarMataKuliah = ref([])
const selectedMataKuliah = ref([])
const showModal = ref(false)
const loading = ref(true)

const token = localStorage.getItem('token')

watchEffect(async () => {
  const mahasiswaId = props.user?.mahasiswa?.id
  if (!mahasiswaId) return

  loading.value = true

  try {
    // Ambil mata kuliah yang diambil mahasiswa
    const response = await axios.get(`http://localhost:8000/api/mahasiswa-mata-kuliah/${mahasiswaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mataKuliahDiambil.value = response.data.mata_kuliah
  } catch (error) {
    console.error('Gagal memuat data mata kuliah:', error)
  } finally {
    loading.value = false
  }

  try {
    // Ambil daftar seluruh mata kuliah
    const response = await axios.get('http://localhost:8000/api/matakuliah', {
      headers: { Authorization: `Bearer ${token}` }
    })
    // Filter untuk hanya menampilkan mata kuliah yang belum diambil
    daftarMataKuliah.value = response.data.filter(mk => 
      !mataKuliahDiambil.value.some(diambil => diambil.id === mk.id)
    )
  } catch (error) {
    console.error('Gagal memuat daftar mata kuliah:', error)
  }
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMataKuliah.value = []
}

const removeMataKuliah = async (mataKuliahId) => {

}

</script>
