import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Register from './pages/Register'
import Admin from './pages/Admin'
import Team from './pages/Team'

const Placeholder = ({ title }) => (
  <div className="p-8 text-white/60">{title} (coming soon)</div>
)

export default function App() {
  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
            <nav className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="mr-4 font-semibold">Embrione</span>
        <NavLink to="/register" className={linkClass}>Register</NavLink>
        <NavLink to="/team" className={linkClass}>Team</NavLink>
        <NavLink to="/admin" className={linkClass}>Admin</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/team" element={<Team />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  )
}