import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Must load first: applies the laptop / 4K page scale before anything renders
// (previously it only ran when the lazy GlobalSection chunk loaded => late layout jump)
import './utils/pageScale.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)