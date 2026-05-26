import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/**
 * Axios instance yang sudah dikonfigurasi.
 * Base URL diambil dari environment variable VITE_API_BASE_URL.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ===== Request Interceptor =====
api.interceptors.request.use(
  (config) => {
    // Tambahkan token auth jika ada
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ===== Response Interceptor =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status } = error.response
      const originalRequest = error.config
      
      // Token expired / unauthorized → redirect ke login
      // Jangan redirect jika error berasal dari endpoint login
      // Jangan redirect jika user sedang di halaman admin (admin punya flow sendiri)
      const isLoginRequest = originalRequest?.url?.includes('/auth/login')
      const isOnAdminPage = window.location.pathname.startsWith('/admin')
      
      if (status === 401 && !isLoginRequest && !isOnAdminPage) {
        localStorage.removeItem('token')
        window.location.href = '/masuk'
      }
    }
    return Promise.reject(error)
  }
)

export default api
