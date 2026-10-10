export default function MemberCard({ member }) {
  const { name, domain, position, branch, semester, bio, photoUrl } = member

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img src={photoUrl} alt={name || 'Profile'}
            className="h-20 w-20 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-white/40" fill="currentColor">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
            </svg>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{name || 'Your name'}</h3>
          <p className="truncate text-sm text-cyan-300">{position || 'Position'}</p>
          <p className="truncate text-sm text-white/60">{domain || 'Domain'}</p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm text-white/70">
        {bio || 'Your short bio will appear here.'}
      </p>
      <p className="mt-4 text-xs text-white/50">
        {branch || 'Branch'}{semester ? `, Semester ${semester}` : ''}
      </p>
    </div>
  )
}