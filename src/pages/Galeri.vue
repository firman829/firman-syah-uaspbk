<template>
  <section class="space-y-12 p-6">
    <!-- ===== Form tambah foto ===== -->
    <div class="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4 text-blue-700">Tambah Foto Kegiatan</h2>

      <form @submit.prevent="simpanFoto" class="space-y-4">
        <div>
          <label class="block font-medium mb-1">Gambar (JPG/PNG ≤ 200 KB)</label>
          <input type="file" accept="image/*" required @change="handleFile"
                 class="w-full file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 rounded" />
          <img v-if="preview" :src="preview" class="mt-2 w-40 rounded shadow" />
        </div>

        <div>
          <label class="block font-medium mb-1">Penjelasan Kegiatan</label>
          <textarea v-model="form.deskripsi" required rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200"></textarea>
        </div>

        <button class="px-4 py-2 rounded shadow bg-blue-600 hover:bg-blue-700 text-white">
          Simpan
        </button>
      </form>
    </div>

    <!-- ===== Grid Galeri ===== -->
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Galeri Kegiatan</h2>
      <div v-if="galeri.length"
           class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <figure v-for="g in galeri" :key="g.id"
                class="bg-white rounded-lg shadow overflow-hidden flex flex-col cursor-pointer"
                @click="openModal(g)">
          <div class="relative w-full pb-[75%]">
            <img :src="g.imageData" class="absolute inset-0 w-full h-full object-cover" />
          </div>
          <figcaption class="p-4 text-gray-700 text-sm truncate">{{ g.deskripsi }}</figcaption>
        </figure>
      </div>
      <p v-else class="text-center text-gray-500">Belum ada kegiatan.</p>
    </div>

    <!-- ===== Modal Detail / Edit ===== -->
    <div v-if="showModal"
         class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
        <button @click="closeModal"
                class="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-600">✕</button>

        <!-- ===== Tampilan Detail ===== -->
        <template v-if="!editMode">
          <img :src="active.imageData" class="w-full max-h-[60vh] object-contain rounded shadow"/>
          <p class="mt-4 text-gray-700 whitespace-pre-line">{{ active.deskripsi }}</p>

          <div class="mt-6 flex gap-3">
            <button @click="startEdit"
                    class="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white">Edit</button>
            <button @click="hapusKegiatan(active.id)"
                    class="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Hapus</button>
          </div>
        </template>

        <!-- ===== Form Edit ===== -->
        <template v-else>
          <h3 class="text-lg font-bold mb-4 text-blue-700">Edit Kegiatan</h3>

          <div class="mb-4">
            <label class="block font-medium mb-1">Ganti Gambar (opsional, ≤ 200 KB)</label>
            <input type="file" accept="image/*" @change="handleEditFile"
                   class="w-full file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 rounded" />
            <img v-if="editPreview" :src="editPreview"
                 class="mt-2 w-40 rounded shadow"/>
          </div>

          <textarea v-model="editDesc" rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-200"></textarea>

          <div class="flex gap-3 mt-4">
            <button @click="simpanEdit"
                    class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">Simpan</button>
            <button @click="editMode=false"
                    class="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100">Batal</button>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

/* ---------- State utama ---------- */
const galeri  = ref([])
const form    = reactive({ imageData:'', deskripsi:'' })
const preview = ref('')

/* ---------- Modal state ---------- */
const showModal  = ref(false)
const active     = ref(null)
const editMode   = ref(false)
const editDesc   = ref('')
const editImg    = ref('')
const editPreview= ref('')

/* ---------- Fetch awal ---------- */
onMounted(loadGaleri)
async function loadGaleri() {
  const { data } = await axios.get('http://localhost:3000/galeri?_sort=id&_order=desc')
  galeri.value = data
}

/* ---------- Tambah kegiatan ---------- */
function handleFile(e){
  const file=e.target.files[0]
  if(!file) return
  if(file.size>200*1024) return alert('Maks 200 KB')
  const fr=new FileReader()
  fr.onload=()=>{ form.imageData=preview.value=fr.result }
  fr.readAsDataURL(file)
}
async function simpanFoto(){
  if(!form.imageData) return alert('Pilih gambar.')
  const { data } = await axios.post('http://localhost:3000/galeri', form)
  galeri.value.unshift(data)
  form.imageData=''; form.deskripsi=''; preview.value=''
}

/* ---------- Modal detail ---------- */
function openModal(item){
  active.value=item
  showModal.value=true
  editMode.value=false
}
function closeModal(){ showModal.value=false }

/* ---------- Hapus ---------- */
async function hapusKegiatan(id){
  if(!confirm('Hapus kegiatan ini?')) return
  await axios.delete(`http://localhost:3000/galeri/${id}`)
  galeri.value=galeri.value.filter(g=>g.id!==id)
  closeModal()
}

/* ---------- Edit ---------- */
function startEdit(){
  editMode.value=true
  editDesc.value=active.value.deskripsi
  editImg.value=''          // kosong = tidak diganti
  editPreview.value=active.value.imageData
}
function handleEditFile(e){
  const file=e.target.files[0]
  if(!file) return
  if(file.size>200*1024) return alert('Maks 200 KB')
  const fr=new FileReader()
  fr.onload=()=>{ editImg.value=editPreview.value=fr.result }
  fr.readAsDataURL(file)
}
async function simpanEdit(){
  const payload={
    deskripsi: editDesc.value,
    imageData: editImg.value || active.value.imageData
  }
  const { data } = await axios.patch(`http://localhost:3000/galeri/${active.value.id}`, payload)
  const idx=galeri.value.findIndex(g=>g.id===data.id)
  if(idx!==-1) galeri.value[idx]=data
  active.value=data
  editMode.value=false
}
</script>
