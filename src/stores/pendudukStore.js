import { defineStore } from 'pinia'
import axios from 'axios'

export const usePendudukStore = defineStore('penduduk', {
  state: () => ({
    penduduk: []
  }),
  actions: {
    async fetchPenduduk() {
      const res = await axios.get('http://localhost:3000/penduduk')
      this.penduduk = res.data
    },
    async tambahPenduduk(data) {
      await axios.post('http://localhost:3000/penduduk', data)
      this.fetchPenduduk()
    }
  }
})
