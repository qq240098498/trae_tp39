import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from '@/pages/Dashboard'
import Appliances from '@/pages/Appliances'
import Logs from '@/pages/Logs'
import { Home, Settings, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/appliances', icon: Settings, label: '电器' },
  { to: '/logs', icon: ClipboardList, label: '记录' },
]

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/appliances" element={<Appliances />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-lg md:relative md:border-b md:border-t-0">
        <div className="mx-auto flex max-w-5xl items-center justify-around py-2 md:justify-start md:gap-1 md:px-4 md:py-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 text-xs transition-all duration-200 md:flex-row md:gap-2 md:text-sm',
                  isActive
                    ? 'text-orange-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}
