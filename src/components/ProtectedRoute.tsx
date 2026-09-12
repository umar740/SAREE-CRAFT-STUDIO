import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivorydeep">
        <p className="text-inksoft font-semibold">Loading…</p>
      </div>
    )
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
