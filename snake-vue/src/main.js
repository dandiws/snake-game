import { createApp } from 'vue'
import App from './App.vue'

createApp(App, {
  gridSize: [30, 30],
  intervalTime: 100
}).mount('#app')
