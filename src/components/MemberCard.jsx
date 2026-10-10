function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  )
}

function safeUrl(url) {
  if (!url) return ''
  const u = url.trim()
  if (!u) return ''
  return /^https?:\/\//i.test(u) ? u : `https://${u}`
}

export default function MemberCard({ member }) {
  const {
    name, domain, position, branch, semester, bio, photoUrl,
    linkedin_url, github_url,
  } = member

  const linkedin = safeUrl(linkedin_url)
  const github = safeUrl(github_url)

  return (
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-500/10">
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

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-white/50">
          {branch || 'Branch'}{semester ? `, Semester ${semester}` : ''}
        </p>
        <div className="flex gap-3 text-white/60">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noreferrer"
              aria-label="LinkedIn" className="hover:text-cyan-300">
              <LinkedInIcon />
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noreferrer"
              aria-label="GitHub" className="hover:text-cyan-300">
              <GitHubIcon />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}