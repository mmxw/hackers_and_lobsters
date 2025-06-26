import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/hackers_and_lobsters/',
    server: {
        port: 3000,
        open: true
    }
})
