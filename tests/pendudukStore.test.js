import { setActivePinia, createPinia } from 'pinia'
import { usePendudukStore } from '../src/store/pendudukStore'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Penduduk Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add penduduk data', async () => {
    const store = usePendudukStore()
    await store.tambahPenduduk({ nama: 'Siti', nik: '123', umur: 30 })
    expect(store.penduduk.length).toBeGreaterThan(0)
  })
})
