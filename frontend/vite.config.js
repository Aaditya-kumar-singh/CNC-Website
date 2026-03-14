import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('appwrite')) return 'appwrite-vendor'
          if (id.includes('axios')) return 'network-vendor'
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes(`${'/react/'}`) ||
            id.includes('\\react\\') ||
            id.includes('scheduler')
          ) return 'react-vendor'
          if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('@headlessui')) return 'ui-vendor'

          return undefined
        },
      },
    },
  },
})
