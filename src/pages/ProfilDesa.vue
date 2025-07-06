<template>
  <section class="space-y-12">
    <!-- ========= Info Umum ========= -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-blue-700 mb-4">Profil Desa</h1>
      <ul class="grid md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
        <li><span class="font-medium">Nama Desa:</span> {{ profil.nama }}</li>
        <li><span class="font-medium">Kabupaten:</span> {{ profil.kabupaten }}</li>
        <li><span class="font-medium">Kecamatan:</span> {{ profil.kecamatan }}</li>
        <li><span class="font-medium">Provinsi:</span> {{ profil.provinsi }}</li>
        <li><span class="font-medium">Negara:</span> {{ profil.negara }}</li>
      </ul>
    </div>

    <!-- ========= Sejarah ========= -->
    <div class="bg-gray-50 rounded-lg shadow-inner p-6 leading-relaxed">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Sejarah Desa</h2>
      <p class="text-gray-700 whitespace-pre-line">{{ sejarah }}</p>
    </div>

    <!-- ========= Pejabat ========= -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Struktur Pemerintahan</h2>
      <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
        <div
          v-for="(nama, jabatan) in pejabat"
          :key="jabatan"
          class="flex flex-col items-center bg-white p-6 rounded-lg shadow"
        >
          <img
            src="https://source.unsplash.com/96x96?face"
            class="w-24 h-24 rounded-full mb-4 object-cover shadow"
            alt="avatar"
          />
          <h3 class="font-semibold text-gray-700 text-center capitalize">
            {{ jabatan.replaceAll('_', ' ') }}
          </h3>
          <p class="text-gray-600 text-center">{{ nama }}</p>
        </div>
      </div>
    </div>

    <!-- ========= Lokasi (Maps) ========= -->
    <div>
      <h2 class="text-xl font-bold text-gray-800 mb-4">Lokasi Desa</h2>
      <div class="rounded-lg shadow overflow-hidden">
        <iframe
          v-if="embedMapUrl"
          :src="embedMapUrl"
          class="w-full h-[450px] border-0"
          allowfullscreen
          loading="lazy"
        />
        <p v-else class="text-center text-gray-400 py-8">
          Link lokasi belum tersedia.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

const profil  = ref({})
const sejarah = ref('')
const pejabat = ref({})

/* ---------- fungsi fetch ---------- */
const getProfil = async () => {
  try {
    const [pr, sj, pj] = await Promise.all([
      axios.get('http://localhost:3000/profil'),
      axios.get('http://localhost:3000/sejarah'),
      axios.get('http://localhost:3000/pejabat')
    ])
    profil.value  = pr.data
    sejarah.value = sj.data.isi
    pejabat.value = pj.data
  } catch (e) {
    console.error('Gagal memuat data profil desa:', e)
  }
}

/* ---------- onMounted + polling ---------- */
let timer
onMounted(() => {
  getProfil()
  // refetch setiap 10 detik (sesuaikan kebutuhan)
  timer = setInterval(getProfil, 10_000)
})
onUnmounted(() => clearInterval(timer))

/* ---------- embed maps ---------- */
const embedMapUrl = computed(() => {
  const src = (profil.value.map_link || '').trim()
  if (!src) return ''
  if (src.includes('/maps/embed')) return src
  if (src.includes('google.com/maps')) {
    try {
      const u = new URL(src)
      const q =
        u.searchParams.get('q') ||
        (u.pathname.includes('/place/')
          ? u.pathname.split('/place/')[1]
          : u.pathname)
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
    } catch { /* ignore */ }
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(src)}&output=embed`
})
</script>
