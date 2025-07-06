<template>
  <section class="p-6 space-y-10 bg-gradient-to-br from-white via-blue-50 to-white">
    <!-- ===== Header + total ===== -->
    <div class="flex items-center gap-3">
      <h2 class="text-2xl font-bold text-blue-700">Data Penduduk</h2>
      <span class="bg-blue-600 text-white text-sm font-semibold px-2 py-0.5 rounded-full">
        {{ totalPenduduk }}
      </span>
    </div>

    <!-- ===== Tabel ===== -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="bg-blue-200 text-gray-700">
            <th class="p-2 border">Nama</th>
            <th class="p-2 border">NIK</th>
            <th class="p-2 border w-16">Umur</th>
            <th class="p-2 border">KK</th>
            <th class="p-2 border w-28 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in penduduk" :key="p.id" class="odd:bg-white even:bg-gray-50">
            <td class="p-2 border">{{ p.nama }}</td>
            <td class="p-2 border">{{ p.nik }}</td>
            <td class="p-2 border">{{ p.umur }}</td>
            <td class="p-2 border">
              <a v-if="p.kkData" :href="p.kkData" target="_blank"
                 class="text-blue-600 hover:underline">Lihat KK</a>
            </td>
            <td class="p-2 border">
              <div class="flex gap-2 justify-center">
                <button @click="startEdit(p)"
                  class="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-sm">
                  Edit
                </button>
                <button @click="hapusPenduduk(p.id)"
                  class="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm">
                  Hapus
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!penduduk.length">
            <td colspan="5" class="p-4 text-center text-gray-500">Belum ada data.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-gray-600">Total penduduk terdaftar: <strong>{{ totalPenduduk }}</strong></p>

    <!-- ===== Form Edit ===== -->
    <div v-if="editingId" class="bg-white max-w-xl mx-auto p-6 rounded shadow-md">
      <h3 class="text-xl font-bold mb-4 text-blue-700">Edit Penduduk</h3>
      <form @submit.prevent="updatePenduduk" class="space-y-4">
        <div>
          <label class="block font-medium mb-1">Nama</label>
          <input v-model="editForm.nama" required
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
        </div>

        <div>
          <label class="block font-medium mb-1">NIK</label>
          <input v-model="editForm.nik" required minlength="16" maxlength="16"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
        </div>

        <div>
          <label class="block font-medium mb-1">Umur</label>
          <input v-model="editForm.umur" type="number" min="0" required
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
        </div>

        <div>
          <label class="block font-medium mb-1">Ganti KK (≤ 200 KB, opsional)</label>
          <input type="file" accept="image/*" @change="handleKK"
            class="w-full file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 rounded">
          <img v-if="previewKK" :src="previewKK" class="mt-2 w-40 rounded shadow">
        </div>

        <div class="flex gap-3">
          <button class="px-4 py-2 rounded shadow bg-blue-600 hover:bg-blue-700 text-white">
            Simpan Perubahan
          </button>
          <button type="button" @click="cancelEdit"
            class="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100">
            Batal
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const penduduk  = ref([])
const editingId = ref(null)
const editForm  = ref({ id:'', nama:'', nik:'', umur:'', kkData:'' })
const previewKK = ref('')

const totalPenduduk = computed(() => penduduk.value.length)

/* --- fetch awal --- */
onMounted(fetchPenduduk)

async function fetchPenduduk() {
  try {
    const { data } = await axios.get('http://localhost:3000/penduduk?_sort=id&_order=desc')
    penduduk.value = data
  } catch (e) {
    alert('Gagal memuat data.'); console.error(e)
  }
}

/* --- hapus --- */
async function hapusPenduduk(id) {
  if (!confirm('Hapus data ini?')) return
  try {
    await axios.delete(`http://localhost:3000/penduduk/${id}`)
    penduduk.value = penduduk.value.filter(p => p.id !== id)
    if (editingId.value === id) cancelEdit()
  } catch (e) {
    alert('Gagal hapus.'); console.error(e)
  }
}

/* --- edit --- */
function startEdit(p) {
  editingId.value = p.id
  editForm.value  = { ...p }          // salin semua field (termasuk id)
  previewKK.value = p.kkData || ''
}
function cancelEdit() {
  editingId.value = null
  editForm.value  = { id:'', nama:'', nik:'', umur:'', kkData:'' }
  previewKK.value = ''
}

/* --- upload KK --- */
function handleKK(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 200 * 1024) return alert('Maks 200 KB.')
  const rd = new FileReader()
  rd.onload = () => { previewKK.value = editForm.value.kkData = rd.result }
  rd.readAsDataURL(file)
}

/* --- simpan perubahan --- */
async function updatePenduduk() {
  try {
    const { data } = await axios.patch(
      `http://localhost:3000/penduduk/${editingId.value}`,
      editForm.value,
      { headers: { 'Content-Type': 'application/json' } }
    )
    const idx = penduduk.value.findIndex(p => p.id === editingId.value)
    if (idx !== -1) {
      /* gunakan splice supaya reaktif */
      penduduk.value.splice(idx, 1, data)
    }
    cancelEdit()
  } catch (e) {
    alert('Gagal menyimpan perubahan.'); console.error(e)
  }
}
</script>
