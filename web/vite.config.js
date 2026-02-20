import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
    // Load env variables so vite.config itself can read VITE_* vars
  

    const apiTarget = env.VITE_API_URL || 'http://localhost:3000'
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');


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

                    target: env.VITE_BACKEND_URL || 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                },
                '/health': {

                    target: env.VITE_BACKEND_URL || 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                }
            }
        }
    }
})

