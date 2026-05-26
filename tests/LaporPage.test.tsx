import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LaporPage from '../src/pages/LaporPage'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider, useToast } from '../src/components/Toast'

// Mock dependencies
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => <div />,
  Marker: () => <div />,
  useMapEvents: () => ({}),
  useMap: () => ({ setView: vi.fn(), getZoom: vi.fn(() => 13) })
}))

vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(),
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn()
      }
    }
  }
}))

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({})
  }
}))

vi.mock('@/lib/exif', () => ({
  extractGPS: vi.fn().mockResolvedValue({ lat: -8.1, lng: 113.6 })
}))

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<any>('framer-motion')
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>
  }
})

const mockShowToast = vi.fn()
vi.mock('../src/components/Toast', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useToast: () => ({
      showToast: mockShowToast
    })
  }
})

describe('LaporPage Form Validations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('prevents navigation to Step 2 if no photos are selected', async () => {
    render(
      <MemoryRouter>
        <LaporPage />
      </MemoryRouter>
    )
    
    // We are on Step 1. Click Lanjut
    const lanjutBtn = screen.getByRole('button', { name: /Lanjut/i })
    fireEvent.click(lanjutBtn)
    
    expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({
      type: 'warning',
      message: 'Silakan unggah minimal 1 foto laporan terlebih dahulu.'
    }))
  })

  it('prevents navigation to Step 3 if map details are incomplete', async () => {
    render(
      <MemoryRouter>
        <LaporPage />
      </MemoryRouter>
    )
    
    // Upload a mock file
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    
    // Wait for the photo preview to render
    await waitFor(() => {
      expect(screen.getByAltText('Foto 1')).toBeInTheDocument()
    })
    
    // Now click Lanjut and wait for it to enter Step 2
    const lanjutBtn = screen.getByRole('button', { name: /Lanjut/i })
    fireEvent.click(lanjutBtn)
    await waitFor(() => {
      expect(screen.getByText(/Langkah 2 dari 3/i)).toBeInTheDocument()
    })
    
    // Now we are on Step 2. Click Lanjut again
    const lanjutBtn2 = screen.getByRole('button', { name: /Lanjut/i })
    fireEvent.click(lanjutBtn2)
    
    expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({
      type: 'warning',
      message: 'Pastikan titik lokasi di peta, area kecamatan, dan detail nama jalan sudah terisi lengkap.'
    }))
  })

  it('prevents submission if jenis kerusakan is not selected', async () => {
    render(
      <MemoryRouter>
        <LaporPage />
      </MemoryRouter>
    )
    
    // Step 1: Upload file
    const file = new File(['hello'], 'hello.png', { type: 'image/png' })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, { target: { files: [file] } })
    
    // Wait for the photo preview to render
    await waitFor(() => {
      expect(screen.getByAltText('Foto 1')).toBeInTheDocument()
    })
    
    const lanjutBtn = screen.getByRole('button', { name: /Lanjut/i })
    fireEvent.click(lanjutBtn)
    await waitFor(() => {
      expect(screen.getByText(/Langkah 2 dari 3/i)).toBeInTheDocument()
    })
    
    // Step 2: Fill area and namaJalan
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Jalan Rusak Parah' } })
    
    const selectArea = screen.getByRole('combobox')
    fireEvent.change(selectArea, { target: { value: 'Andir' } })
    
    const lanjutBtn2 = screen.getByRole('button', { name: /Lanjut/i })
    fireEvent.click(lanjutBtn2)
    await waitFor(() => {
      expect(screen.getByText(/Langkah 3 dari 3/i)).toBeInTheDocument()
    })
    
    // Step 3: Try submitting
    const submitBtn = screen.getByRole('button', { name: /Kirim Laporan/i })
    fireEvent.click(submitBtn)
    
    expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({
      type: 'warning',
      message: 'Pilih salah satu jenis kerusakan terlebih dahulu.'
    }))
  })
})
