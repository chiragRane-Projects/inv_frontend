import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function useRoleAccess(allowedRoles = []) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      toast.error('Access denied. Insufficient permissions.')
      router.push('/dashboard')
    }
  }, [user, allowedRoles, router])

  return {
    hasAccess: !allowedRoles.length || (user && allowedRoles.includes(user.role)),
    userRole: user?.role
  }
}

export function withRoleAccess(Component, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { hasAccess } = useRoleAccess(allowedRoles)
    
    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </div>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}