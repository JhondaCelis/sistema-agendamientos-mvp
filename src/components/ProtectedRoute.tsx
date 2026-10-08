import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type UserRole = 'system_admin' | 'professional'

interface ProtectedRouteProps {
  children: ReactNode
  role: UserRole
}

function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function validateAccess() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      if (role === 'system_admin') {
        const { data, error } = await supabase
          .from('system_admins')
          .select('id')
          .maybeSingle()

        setAuthorized(!error && !!data)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('professionals')
        .select('id')
        .maybeSingle()

      setAuthorized(!error && !!data)
      setLoading(false)
    }

    validateAccess()
  }, [role])

  if (loading) {
    return <p>Validando acceso...</p>
  }

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute