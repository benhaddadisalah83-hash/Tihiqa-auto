import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ThiqaVitrine from './pages/Vitrine'
import ThiqaRapport from './pages/Rapport'
import ThiqaAgent   from './pages/Agent'
import ThiqaAdmin   from './pages/Admin'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<ThiqaVitrine />} />
        <Route path="/r/:id"  element={<ThiqaRapport />} />
        <Route path="/agent"  element={<ThiqaAgent />} />
        <Route path="/admin"  element={<ThiqaAdmin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
