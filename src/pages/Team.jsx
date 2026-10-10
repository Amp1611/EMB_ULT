import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import MemberCard from '../components/MemberCard'

const DOMAINS = ['Web Development', 'Design', 'Logistics', 'Operations',
  'Sponsorship', 'Hospitality', 'Social Media', 'Event Management']
const POSITIONS = ['Head', 'Vice-Head', 'Core Member', 'Member']

const selectClass =
  'rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400'

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [domain, setDomain] = useState('')
  const [position, setPosition] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true })
      setMembers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const visible = members.filter(
    (m) => (!domain || m.domain === domain) && (!position || m.position === position)
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <h1 className="gradient-text text-3xl font-bold">Meet the team</h1>

      <div className="flex flex-wrap gap-3">
        <select value={domain} onChange={(e) => setDomain(e.target.value)} className={selectClass}>
          <option value="">All domains</option>
          {DOMAINS.map((d) => <option key={d} value={d} className="bg-neutral-900">{d}</option>)}
        </select>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className={selectClass}>
          <option value="">All positions</option>
          {POSITIONS.map((p) => <option key={p} value={p} className="bg-neutral-900">{p}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : visible.length === 0 ? (
        <p className="text-white/60">No members match these filters.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m) => (
            <MemberCard key={m.id} member={{ ...m, photoUrl: m.photo_url }} />
          ))}
        </div>
      )}
    </div>
  )
}