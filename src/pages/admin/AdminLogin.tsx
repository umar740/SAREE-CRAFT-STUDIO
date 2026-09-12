import { useState, FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const { session, isAdmin, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-winedark px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl2 p-8 w-full max-w-sm shadow-card">
        <div className="text-center mb-5">
          <span
            className="inline-block w-9 h-9 rounded-full"
            style={{ background: 'conic-gradient(from 200deg, #6E1E3C, #B8923F, #1F4B4A, #6E1E3C)' }}
          />
          <h2 className="font-display text-2xl text-winedark mt-3">Admin Login</h2>
          <p className="text-xs text-inksoft mt-1">Sign in to manage your saree business.</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3.5 py-2.5 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1.5">Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@example.com" />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-bold mb-1.5">Password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        <button disabled={submitting} className="w-full bg-wine hover:bg-winedark disabled:opacity-50 text-ivory font-bold py-3.5 rounded-full transition-colors">
          {submitting ? 'Signing in…' : 'Log In'}
        </button>
        <p className="text-center text-xs mt-4">
          <a href="/" className="text-wine font-bold">← Back to site</a>
        </p>
      </form>
    </div>
  )
}
