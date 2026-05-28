import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 👇 로컬 개발 서버용 프록시(Proxy) 설정 추가
  server: {
    proxy: {
      // localhost:5173/admin_api로 들어오는 요청을 실제 서버로 전달
      '/admin_api': {
        target: 'https://gym.tangoplus.co.kr',
        changeOrigin: true,
        secure: false,
      },
      // localhost:5173/proxy-data로 들어오는 요청 처리
      '/proxy-data': {
        target: 'https://gym.tangoplus.co.kr',
        changeOrigin: true,
        secure: false,
        // 필요하다면 가상 경로(/proxy-data)를 실제 서버 경로(/data/Results)로 바꿔서 찌릅니다.
        rewrite: (path) => path.replace(/^\/proxy-data/, '/data/Results'),
      },
    },
  },
})