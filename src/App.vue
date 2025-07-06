<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isOpen = ref(false)
const toggleDrawer = () => (isOpen.value = !isOpen.value)
const closeDrawer = () => (isOpen.value = false)

const route = useRoute()
</script>

<template>
  <div class="font-sans">
    <!-- === Navbar === -->
    <header class="fixed inset-x-0 top-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow z-50 flex items-center justify-between px-4 md:px-8 py-3">
      <div class="flex items-center gap-4">
        <button
          class="text-2xl bg-white text-blue-700 px-3 py-1 rounded-md shadow hover:bg-gray-100 transition font-bold"
          @click="toggleDrawer"
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h1 class="text-xl font-bold text-white whitespace-nowrap tracking-wide">
          Desa Bencah Kelubi
        </h1>
      </div>

      <!-- === Horizontal Menu (desktop) === -->
      <nav class="hidden md:flex gap-6 text-white font-semibold">
        <router-link
          to="/"
          :class="route.path === '/' ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'"
        >Beranda</router-link>
        <router-link
          to="/profil"
          :class="route.path === '/profil' ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'"
        >Profil Desa</router-link>
        <router-link
          to="/penduduk/form"
          :class="route.path === '/penduduk/form' ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'"
        >Form Penduduk Baru</router-link>
        <router-link
          to="/penduduk/data"
          :class="route.path === '/penduduk/data' ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'"
        >Data Penduduk</router-link>
        <router-link
          to="/galeri"
          :class="route.path === '/galeri' ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'"
        >Galeri</router-link>
        <router-link
          to="/berita-desa"
          :class="route.path === '/berita-desa' ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'"
        >Berita Desa</router-link>
      </nav>
    </header>

    <!-- === Overlay Backdrop === -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40" @click="closeDrawer"></div>

    <!-- === Drawer Slide-in === -->
    <aside
      :class="[
        'fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-lg',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex justify-between items-center p-4 border-b border-blue-300">
        <h2 class="text-lg font-semibold">Menu Desa</h2>
        <button
          @click="closeDrawer"
          class="text-xl hover:text-red-300 transition"
          aria-label="Tutup drawer"
        >
          ✕
        </button>
      </div>

      <!-- === Menu drawer (vertikal) === -->
      <nav class="flex flex-col gap-4 px-6 py-6 font-medium">
        <router-link
          to="/"
          :class="route.path === '/' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-300'"
        >🏠 Beranda</router-link>
        <router-link
          to="/profil"
          :class="route.path === '/profil' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-300'"
        >🧭 Profil Desa</router-link>
        <router-link
          to="/penduduk/form"
          :class="route.path === '/penduduk/form' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-300'"
        >📝 Form Penduduk Baru</router-link>
        <router-link
          to="/penduduk/data"
          :class="route.path === '/penduduk/data' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-300'"
        >📋 Data Penduduk</router-link>
        <router-link
          to="/galeri"
          :class="route.path === '/galeri' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-300'"
        >🖼️ Galeri</router-link>
        <router-link
          to="/berita-desa"
          :class="route.path === '/berita-desa' ? 'text-yellow-300 font-bold' : 'hover:text-yellow-300'"
        >📰 Berita Desa</router-link>
      </nav>
    </aside>

    <!-- === Main Content === -->
    <main class="pt-20 p-6 bg-gray-100 min-h-screen">
      <router-view />
    </main>
  </div>
</template>
