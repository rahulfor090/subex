import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
    // Load env variables so vite.config itself can read VITE_* vars
    const env = loadEnv(mode, process.cwd(), '')

    const apiTarget = env.VITE_API_URL || 'http://localhost:3000'

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            port: 5173,
            open: true,
            proxy: {
                '/api': {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                },
                '/health': {
                    target: apiTarget,
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    }
})

