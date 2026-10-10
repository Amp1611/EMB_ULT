import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../supabase'

const ADMIN_EMAIL = 'admin@embrione.pes.edu'
const ADMIN_PASSWORD = 'EmbrioneAdmin@2026'

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('embrione_admin', 'true')
      onLogin()
    } else {
      toast.error('Wrong email or password')
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-16 w-full max-w-sm space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
      <button type="submit"
        className="w-full rounded-lg bg-cyan-500 px-5 py-2 font-medium text-black hover:bg-cyan-400">
        Log in
      </button>
    </form>
  )
}

function Counter({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  )
}

function Dashboard({ onLogout }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error(error.message)
    } else {
      setMembers(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const setStatus = async (id, status) => {
    const { error } = await supabase.from('members').update({ status }).eq('id', id)
    if (error) return toast.error(error.message)
    toast.success(status === 'approved' ? 'Approved' : 'Rejected')
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this profile permanently?')) return
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) return toast.error(error.message)
    toast.success('Deleted')
    load()
  }

  const pending = members.filter((m) => m.status === 'pending')
  const approved = members.filter((m) => m.status === 'approved')
  const rejected = members.filter((m) => m.status === 'rejected')
  const shown = { pending, approved, rejected }[tab]

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Moderation</h1>
        <button onClick={onLogout}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:text-white">
          Log out
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Counter label="Total submissions" value={members.length} />
        <Counter label="Pending" value={pending.length} />
        <Counter label="Approved" value={approved.length} />
      </div>

      <div className="flex gap-2">
        {[
          ['pending', 'Pending', pending.length],
          ['approved', 'Approved', approved.length],
          ['rejected', 'Rejected', rejected.length],
        ].map(([key, label, count]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              tab === key ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
            }`}>
            {label} ({count})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : shown.length === 0 ? (
        <p className="text-white/60">Nothing here.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((m) => (
            <div key={m.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
              <img src={m.photo_url} alt={m.name}
                className="h-16 w-16 shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{m.name}</p>
                <p className="truncate text-sm text-white/60">
                  {m.position}, {m.domain}
                </p>
                <p className="truncate text-xs text-white/50">
                  {m.srn}, {m.branch}, Sem {m.semester}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-white/70">{m.bio}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {m.status !== 'approved' && (
                  <button onClick={() => setStatus(m.id, 'approved')}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-emerald-400">
                    Approve
                  </button>
                )}
                {m.status !== 'rejected' && (
                  <button onClick={() => setStatus(m.id, 'rejected')}
                    className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-black hover:bg-red-400">
                    Reject
                  </button>
                )}
                <button onClick={() => remove(m.id)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:text-white">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem('embrione_admin') === 'true'
  )

  const logout = () => {
    sessionStorage.removeItem('embrione_admin')
    setLoggedIn(false)
  }

  return loggedIn ? <Dashboard onLogout={logout} /> : <Login onLogin={() => setLoggedIn(true)} />
}