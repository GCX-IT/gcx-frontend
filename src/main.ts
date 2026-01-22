import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import 'primeicons/primeicons.css'
// TinyMCE will be loaded from CDN via the Vue wrapper when API key is provided
import App from './App.vue'
import './plugins/axios'
import { useAuthStore } from './stores/auth'
import i18n from './plugins/i18n'
import { initializeMarketData } from './utils/marketDataUtils'

// PrimeVue Configuration
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Configure PrimeVue with Aura theme
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: '.dark',
            cssLayer: false
        }
    }
})

// Configure PrimeVue services
app.use(ConfirmationService)
app.use(ToastService)
app.directive('tooltip', Tooltip)

// Initialize auth store after pinia is setup
useAuthStore()
// Don't initialize auth automatically to prevent logout on refresh

// Initialize market data system
initializeMarketData().catch(console.error)

app.mount('#app')
