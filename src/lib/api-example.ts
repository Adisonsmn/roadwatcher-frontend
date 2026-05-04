/**
 * Contoh penggunaan Axios API instance.
 * File ini hanya sebagai referensi, bisa dihapus nanti.
 */
import api from './api'

// ===== Contoh Type =====
interface Report {
  id: string
  title: string
  description: string
  location: string
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
}

// ===== Contoh Service Functions =====

/** Ambil semua laporan */
export const getReports = () => api.get<Report[]>('/reports')

/** Ambil laporan berdasarkan ID */
export const getReportById = (id: string) => api.get<Report>(`/reports/${id}`)

/** Buat laporan baru */
export const createReport = (data: FormData) =>
  api.post<Report>('/reports', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/** Update status laporan */
export const updateReportStatus = (id: string, status: Report['status']) =>
  api.patch<Report>(`/reports/${id}`, { status })

/** Hapus laporan */
export const deleteReport = (id: string) => api.delete(`/reports/${id}`)
