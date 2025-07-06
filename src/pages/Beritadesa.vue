<template>
  <section class="space-y-12">
    <!-- ===== Tabs ===== -->
    <div class="flex gap-4">
      <button :class="tab === 'berita' ? tabActive : tabNormal" @click="tab = 'berita'">Berita</button>
      <button :class="tab === 'event'  ? tabActive : tabNormal" @click="tab = 'event'">Event desa</button>
    </div>

    <!-- ============ TAB BERITA ============ -->
    <template v-if="tab === 'berita'">
      <!-- Form tambah / edit (TANPA gambar) -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-blue-700">
          {{ editingId ? 'Edit Berita' : 'Tambah Berita' }}
        </h2>

        <form @submit.prevent="saveBerita" class="space-y-4">
          <div>
            <label class="block font-medium mb-1">Judul</label>
            <input v-model="news.judul" required type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
          </div>

          <div>
            <label class="block font-medium mb-1">Tanggal</label>
            <input v-model="news.tanggal" required type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200">
          </div>

          <div>
            <label class="block font-medium mb-1">Ringkasan</label>
            <textarea v-model="news.ringkasan" rows="3" required
              class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200"></textarea>
          </div>

          <button class="px-4 py-2 rounded shadow text-white bg-blue-600 hover:bg-blue-700">
            {{ editingId ? 'Perbarui' : 'Simpan' }}
          </button>
          <button v-if="editingId" type="button" @click="resetNews"
            class="ml-2 px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100">
            Batal
          </button>
        </form>
      </div>

      <!-- List berita (tanpa gambar) -->
      <div class="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 class="text-xl font-bold mb-4">Daftar Berita</h2>
        <ul class="space-y-6">
          <li v-for="b in berita" :key="b.id" class="border-b pb-4 last:border-b-0">
            <div class="flex flex-col gap-1">
              <h3 class="font-semibold text-blue-700">{{ b.judul }}</h3>
              <p class="text-sm text-gray-500">{{ b.tanggal }}</p>
              <p class="text-gray-700">{{ b.ringkasan }}</p>
            </div>
            <div class="flex gap-2 mt-2">
              <button @click="editBerita(b)"
                class="px-3 py-1 rounded shadow text-white bg-yellow-500 hover:bg-yellow-600">Edit</button>
              <button @click="hapusBerita(b.id)"
                class="px-3 py-1 rounded shadow text-white bg-red-600 hover:bg-red-700">Hapus</button>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <!-- ============ TAB EVENT ============ -->
    <template v-else>
      <!-- Form tambah event gambar -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-blue-700">Tambah Event desa</h2>
        <form @submit.prevent="saveEvent" class="space-y-4">
          <input type="file" accept="image/*" required @change="onFile($event)"
            class="w-full file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 rounded">
          <img v-if="previewEvent" :src="previewEvent" class="mt-2 w-40 rounded shadow">
          <button class="px-4 py-2 rounded shadow text-white bg-blue-600 hover:bg-blue-700">Simpan Gambar</button>
        </form>
      </div>

      <!-- Grid event -->
      <div class="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 class="text-xl font-bold mb-4">Daftar Event Gambar</h2>
        <div class="grid sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div v-for="e in eventImages" :key="e.id" class="relative group">
            <img :src="e.imageData" class="w-full h-40 object-cover rounded shadow">
            <button @click="hapusEvent(e.id)"
              class="absolute top-2 right-2 hidden group-hover:block bg-red-600 text-white text-xs rounded-full px-2">✕
            </button>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

/* ===== Tabs ===== */
const tab = ref('berita')
const tabActive = 'px-4 py-2 rounded bg-blue-600 text-white'
const tabNormal = 'px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'

/* ===== BERITA state (tanpa gambar) ===== */
const berita = ref([])
const editingId = ref(null)
const news = ref({ judul: '', tanggal: '', ringkasan: '' })

/* ===== EVENT state (dengan gambar) ===== */
const eventImages = ref([])
const previewEvent = ref('')

onMounted(async () => {
  await Promise.all([loadBerita(), loadEvents()])
})

async function loadBerita () {
  const { data } = await axios.get('http://localhost:3000/berita?_sort=id&_order=desc')
  berita.value = data
}
async function loadEvents () {
  const { data } = await axios.get('http://localhost:3000/eventImages?_sort=id&_order=desc')
  eventImages.value = data
}

/* ===== CRUD Berita ===== */
async function saveBerita () {
  if (editingId.value) {
    const { data } = await axios.patch(`http://localhost:3000/berita/${editingId.value}`, news.value)
    const idx = berita.value.findIndex(b => b.id === editingId.value)
    if (idx !== -1) berita.value[idx] = data
  } else {
    const { data } = await axios.post('http://localhost:3000/berita', news.value)
    berita.value.unshift(data)
  }
  resetNews()
}
function editBerita (b) {
  editingId.value = b.id
  news.value = { judul: b.judul, tanggal: b.tanggal, ringkasan: b.ringkasan }
}
async function hapusBerita (id) {
  if (!confirm('Hapus berita?')) return
  await axios.delete(`http://localhost:3000/berita/${id}`)
  berita.value = berita.value.filter(b => b.id !== id)
  if (editingId.value === id) resetNews()
}
function resetNews () {
  editingId.value = null
  news.value = { judul: '', tanggal: '', ringkasan: '' }
}

/* ===== CRUD Event Gambar ===== */
function onFile (e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 200 * 1024) return alert('Maks 200 KB.')

  const rd = new FileReader()
  rd.onload = () => (previewEvent.value = rd.result)
  rd.readAsDataURL(file)
}
async function saveEvent () {
  const obj = { imageData: previewEvent.value }
  const { data } = await axios.post('http://localhost:3000/eventImages', obj)
  eventImages.value.unshift(data)
  previewEvent.value = ''
}
async function hapusEvent (id) {
  if (!confirm('Hapus gambar ini?')) return
  await axios.delete(`http://localhost:3000/eventImages/${id}`)
  eventImages.value = eventImages.value.filter(e => e.id !== id)
}
</script>
