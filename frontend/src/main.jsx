import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './context/AppContext.jsx'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#101018',
            border: '1px solid rgba(198,255,61,0.25)',
            color: '#e5e7eb',
            fontFamily: 'Bricolage Grotesque, sans-serif',
          },
        }}
      />
    </AppProvider>
  </React.StrictMode>
)