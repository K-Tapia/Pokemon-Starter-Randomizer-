import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

//youtube link that helped https://www.youtube.com/watch?v=jXyTIQOfTTk&t=2578s
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      "/api":   {
        target: "http://localhost:3000",
        changeOrigin: true,
        
      }
    }
  }
});