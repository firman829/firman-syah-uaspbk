<template>
  <section class="space-y-12">
    <!-- ===== Form Penduduk Baru ===== -->
    <div class="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4 text-blue-700">Form Penduduk Baru</h2>

      <form @submit.prevent="simpanPenduduk" class="space-y-4">
        <!-- Nama -->
        <div>
          <label class="block font-medium mb-1">Nama Lengkap</label>
          <input v-model="form.nama" required type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
        </div>

        <!-- NIK -->
        <div>
          <label class="block font-medium mb-1">NIK</label>
          <input v-model="form.nik" required type="text" minlength="16" maxlength="16"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
        </div>

        <!-- Umur -->
        <div>
          <label class="block font-medium mb-1">Umur</label>
          <input v-model="form.umur" required type="number" min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
        </div>

        <!-- Upload KK -->
        <div>
          <label class="block font-medium mb-1">Upload KK (JPG/PNG ≤ 200 KB)</label>
          <input type="file" accept="image/*" required @change="handleFile"
            class="w-full file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 rounded">
          <img v-if="previewKK" :src="previewKK" class="mt-2 w-40 rounded shadow">
        </div>

        <!-- Tombol Simpan -->
        <button
          type="submit"
          class="px-4 py-2 rounded shadow text-white bg-blue-600 hover:bg-blue-700"
        >
          Simpan Penduduk
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  nama: '',
  nik: '',
  umur: '',
  kkData: ''
})

const previewKK = ref('')

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 200 * 1024) {
    alert('Ukuran file maksimal 200 KB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    form.value.kkData = previewKK.value = reader.result
  }
  reader.readAsDataURL(file)
}

async function simpanPenduduk() {
  try {
    await axios.post('http://localhost:3000/penduduk', form.value)
    alert('Data penduduk berhasil disimpan.')
    form.value = { nama: '', nik: '', umur: '', kkData: '' }
    previewKK.value = ''
  } catch (e) {
    console.error('Gagal menyimpan:', e)
    alert('Gagal menyimpan data. Silakan coba lagi.')
  }
}
</script>
