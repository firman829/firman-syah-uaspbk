<template>
  <section class="space-y-12">
    <!-- ===== Slider Banner (gambar dari eventImages) ===== -->
    <div class="relative overflow-hidden rounded-xl shadow-lg" v-if="eventImages.length">
      <div
        class="flex transition-transform duration-700 ease-in-out"
        :style="`transform: translateX(-${currentSlide * 100}%);`"
      >
        <div
          v-for="img in eventImages"
          :key="img.id"
          class="flex-shrink-0 w-full h-[260px] sm:h-[380px] bg-cover bg-center"
          :style="`background-image:url(${img.imageData})`"
        />
      </div>

      <!-- Dots -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        <span
          v-for="(img, i) in eventImages"
          :key="i"
          class="w-3 h-3 rounded-full cursor-pointer"
          :class="i === currentSlide ? 'bg-white' : 'bg-white/40'"
          @click="currentSlide = i"
        ></span>
      </div>
    </div>

    <!-- ===== Marquee Acara (teks berjalan) ===== -->
    <div class="overflow-hidden bg-blue-600 py-3 rounded-md shadow" v-if="events.length">
      <div
        class="flex space-x-10 text-white font-semibold tracking-wide animate-text-marquee"
        :style="`animation-duration:${events.length * 6}s`"
      >
        <span v-for="ev in events" :key="ev.id" class="whitespace-nowrap">
          📢 {{ ev.tanggal }} – {{ ev.judul }}
        </span>
      </div>
    </div>

    <!-- ===== Data Pejabat ===== -->
    <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
      <div
        v-for="(nama, jabatan) in pejabat"
        :key="jabatan"
        class="flex flex-col items-center bg-white p-6 rounded-lg shadow-md"
      >
        <img
          src="https://media.istockphoto.com/id/1495088043/id/vektor/ikon-profil-pengguna-avatar-atau-ikon-orang-gambar-profil-simbol-potret-gambar-potret.jpg?s=1024x1024&w=is&k=20&c=etiZ5Q4RKl8ReLQSHxdcLM9yJFOAZdRh7Wi_1Do-JxE="
          class="w-24 h-24 rounded-full mb-4 object-cover shadow"
          alt="avatar"
        />
        <h3 class="font-bold text-gray-700 text-lg text-center capitalize">
          {{ jabatan.replaceAll('_', ' ') }}
        </h3>
        <p class="text-gray-600 text-center">{{ nama }}</p>
      </div>
    </div>

    <!-- ===== Berita Desa (5 terbaru) ===== -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Berita Desa</h2>
      <ul class="space-y-4">
        <li
          v-for="b in berita.slice(0, 5)"
          :key="b.id"
          class="border-b pb-3 last:border-b-0"
        >
          <h3 class="font-semibold text-blue-600">{{ b.judul }}</h3>
          <p class="text-sm text-gray-500">{{ b.tanggal }}</p>
          <p class="text-gray-700 mt-1">{{ b.ringkasan }}</p>
        </li>
      </ul>
    </div>

    <!-- ===== Kontak ===== -->
    <div class="bg-gray-50 rounded-lg shadow-inner p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Kontak Desa</h2>
      <div class="grid md:grid-cols-2 gap-4 text-gray-700">

        <div><p class="font-medium">Telepon</p><p>{{ kontak.telepon }}</p></div>
        <div><p class="font-medium">Email</p><p>{{ kontak.email }}</p></div>
        <div><p class="font-medium">Jam Layanan</p><p>{{ kontak.jam_layanan }}</p></div>
      </div>
    </div>

    <!-- ===== Lokasi Desa ===== -->
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
          Link lokasi belum diatur di <code>profil.map_link</code>.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

/* ===== State ===== */
const eventImages = ref([])
const currentSlide = ref(0)
const events  = ref([])
const pejabat = ref({})
const berita  = ref([])
const kontak  = ref({})
const profil  = ref({})

onMounted(async () => {
  try {
    const [ev, pj, br, kt, pr, imgs] = await Promise.all([
      axios.get('http://localhost:3000/acara'),
      axios.get('http://localhost:3000/pejabat'),
      axios.get('http://localhost:3000/berita?_sort=id&_order=desc'),
      axios.get('http://localhost:3000/kontak'),
      axios.get('http://localhost:3000/profil'),
      axios.get('http://localhost:3000/eventImages')
    ])

    events.value      = ev.data
    pejabat.value     = pj.data
    berita.value      = br.data
    kontak.value      = kt.data
    profil.value      = pr.data
    eventImages.value = imgs.data

    if (eventImages.value.length) {
      setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % eventImages.value.length
      }, 4000)
    }
  } catch (e) {
    console.error('Gagal memuat beranda:', e)
  }
})

/* ===== Peta ===== */
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
    } catch {}
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(src)}&output=embed`
})
</script>

<style>
@keyframes text-marquee {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-text-marquee {
  animation: text-marquee 25s linear infinite;
}
</style>
