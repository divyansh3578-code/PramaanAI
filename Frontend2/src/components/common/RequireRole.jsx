import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

/**
 * Wraps a route element and redirects to /login (preserving the intended
 * destination) unless the signed-in user's role is in `roles`.
 */
export default function RequireRole({ roles, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
