<template>
  <div class="min-h-screen bg-white p-6">
    <h1 class="text-xl font-semibold mb-4">Mata Kuliah yang Diambil</h1>

    <button @click="openModal" class="bg-blue-500 text-white px-4 py-2 mb-5 rounded mt-4">
      Tambah Mata Kuliah
    </button>

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
            <td class="px-4 py-2 border">{{ item.kode_mk }}</td>
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
    </div>

    <!-- Modal Tambah Mata Kuliah -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 class="text-lg font-semibold mb-4">Pilih Mata Kuliah</h2>

        <select v-model="selectedMataKuliahId" class="w-full p-2 border mb-4">
          <option disabled value="">Pilih mata kuliah</option>
          <option v-for="mk in daftarMataKuliah" :key="mk.id" :value="mk.id">
            {{ mk.nama }} - {{ mk.dosen.nama }}
          </option>
        </select>

        <button @click="tambahKeCart" class="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Tambah ke Cart
        </button>

        <!-- Cart Mata Kuliah -->
        <div>
          <h3 class="font-semibold mb-2">Cart Mata Kuliah</h3>
          <ul>
            <li v-for="(item, index) in selectedMataKuliah" :key="index" class="flex justify-between border-b py-1">
              <span>{{ item.nama }} - {{ item.dosen.nama }}</span>
              <button @click="hapusDariCart(item.id)" class="text-red-600 hover:underline">
                Hapus
              </button>
            </li>
          </ul>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button @click="submitMataKuliah" class="bg-blue-600 text-white px-4 py-2 rounded">
            Simpan
          </button>
          <button @click="closeModal" class="bg-gray-400 text-white px-4 py-2 rounded">
            Batal
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
import { useToast } from 'vue-toastification'
const toast = useToast()

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
      !mataKuliahDiambil.value.some(diambil => diambil.id_mata_kuliah === mk.id)
    )
    console.log(daftarMataKuliah.value)
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

const selectedMataKuliahId = ref('')
const tambahKeCart = () => {
  const mk = daftarMataKuliah.value.find(m => m.id === selectedMataKuliahId.value)
  if (mk && !selectedMataKuliah.value.some(item => item.id === mk.id)) {
    selectedMataKuliah.value.push(mk)
    selectedMataKuliahId.value = ''
  }
}

const hapusDariCart = (id) => {
  selectedMataKuliah.value = selectedMataKuliah.value.filter(item => item.id !== id)
}

const submitMataKuliah = async () => {
  if (selectedMataKuliah.value.length === 0) return toast.error("Cart Masih Kosong")

  try {
    const payload = {
      mahasiswa_id: props.user?.mahasiswa?.id,
      mata_kuliah_ids: selectedMataKuliah.value.map(item => item.id)
    }

    await axios.post('http://localhost:8000/api/mahasiswa-mata-kuliah', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    toast.success("Mata kuliah berhasil ditambahkan.")
    closeModal()
    selectedMataKuliah.value = []

    // Refresh data
    const mahasiswaId = props.user?.mahasiswa?.id
    const response = await axios.get(`http://localhost:8000/api/mahasiswa-mata-kuliah/${mahasiswaId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mataKuliahDiambil.value = response.data.mata_kuliah

    // Refresh daftar mata kuliah yang belum diambil (filter ulang)
    const responseAll = await axios.get('http://localhost:8000/api/matakuliah', {
      headers: { Authorization: `Bearer ${token}` }
    })
    daftarMataKuliah.value = responseAll.data.filter(mk =>
      !mataKuliahDiambil.value.some(diambil => diambil.id_mata_kuliah === mk.id)
    )

  } catch (err) {
    console.error("Gagal menyimpan mata kuliah:", err)
    alert("Gagal menyimpan.")
  }
}

</script>
