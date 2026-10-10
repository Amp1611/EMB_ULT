import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import MemberCard from '../components/MemberCard'
import { supabase } from '../supabase'
import { convertToWebP } from '../utils/webp'

const DOMAINS = ['Web Development', 'Design', 'Logistics', 'Operations',
  'Sponsorship', 'Hospitality', 'Social Media', 'Event Management']
const POSITIONS = ['Head', 'Vice-Head', 'Core Member', 'Member']
const BRANCHES = ['CSE', 'AIML', 'ECE', 'EEE', 'ME', 'Biotech', 'Civil']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

const empty = {
  name: '', domain: '', position: '', srn: '', email: '',
  linkedin_url: '', github_url: '', branch: '', semester: '', bio: '',
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-white/70">{label}</span>
      {children}
    </label>
  )
}

export default function Register() {
  const [form, setForm] = useState(empty)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!file) { setPreviewUrl(''); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please choose a profile picture')
      return
    }

    setSubmitting(true)
    try {
      const srn = form.srn.trim().toUpperCase()

      // Duplicate SRN check
      const { data: existing, error: checkError } = await supabase
        .from('members')
        .select('id')
        .eq('srn', srn)
        .limit(1)
      if (checkError) throw checkError
      if (existing.length > 0) {
        toast.error('This SRN has already been submitted')
        return
      }

      // Convert to WebP, then upload
      const webpBlob = await convertToWebP(file)
      const path = `${srn}-${Date.now()}.webp`
      const { error: uploadError } = await supabase.storage
        .from('member-photos')
        .upload(path, webpBlob, { contentType: 'image/webp' })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('member-photos')
        .getPublicUrl(path)

      // Insert the member as pending
      const { error: insertError } = await supabase.from('members').insert({
        ...form,
        srn,
        semester: Number(form.semester),
        photo_url: urlData.publicUrl,
        status: 'pending',
      })
      if (insertError) throw insertError

      toast.success('Submitted! An admin will review your profile.')
      setForm(empty)
      setFile(null)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 p-4 md:p-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-semibold">Join the team</h1>

        <Field label="Full name">
          <input name="name" value={form.name} onChange={set} required className={inputClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Domain">
            <select name="domain" value={form.domain} onChange={set} required className={inputClass}>
              <option value="">Select</option>
              {DOMAINS.map((d) => <option key={d} value={d} className="bg-neutral-900">{d}</option>)}
            </select>
          </Field>
          <Field label="Position">
            <select name="position" value={form.position} onChange={set} required className={inputClass}>
              <option value="">Select</option>
              {POSITIONS.map((p) => <option key={p} value={p} className="bg-neutral-900">{p}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SRN">
            <input name="srn" value={form.srn} onChange={set} placeholder="PES1UG23CS001" required className={inputClass} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" value={form.email} onChange={set} required className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL">
            <input name="linkedin_url" value={form.linkedin_url} onChange={set} className={inputClass} />
          </Field>
          <Field label="GitHub URL">
            <input name="github_url" value={form.github_url} onChange={set} className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Branch">
            <select name="branch" value={form.branch} onChange={set} required className={inputClass}>
              <option value="">Select</option>
              {BRANCHES.map((b) => <option key={b} value={b} className="bg-neutral-900">{b}</option>)}
            </select>
          </Field>
          <Field label="Semester">
            <select name="semester" value={form.semester} onChange={set} required className={inputClass}>
              <option value="">Select</option>
              {SEMESTERS.map((s) => <option key={s} value={s} className="bg-neutral-900">{s}</option>)}
            </select>
          </Field>
        </div>

        <Field label={`Short bio (${form.bio.length}/200, minimum 150)`}>
          <textarea name="bio" value={form.bio} onChange={set} maxLength={200}
            minLength={150} rows={4} required className={inputClass} />
        </Field>

        <Field label="Profile picture">
          <input type="file" accept="image/png,image/jpeg"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-white" />
        </Field>

                <button type="submit" disabled={submitting}
          className="rounded-lg bg-cyan-500 px-5 py-2 font-medium text-black hover:bg-cyan-400 disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit for approval'}
        </button>
      </form>

      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-sm text-white/60">Live preview</p>
        <MemberCard member={{ ...form, photoUrl: previewUrl }} />
      </div>
    </div>
  )
}