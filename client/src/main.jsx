import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StakeContextProvider } from './context/StakeContext.jsx'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StakeContextProvider>
    <App />
    </StakeContextProvider>
    
  </StrictMode>,
)
