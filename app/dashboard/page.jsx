"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Truck,
  Clock,
  CheckCircle,
  Navigation
} from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    loading: true
  })
  const { token, user } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'delivery') {
        const ordersData = await apiFetch('/orders/', {}, token)
        const myDeliveries = ordersData.filter(order => 
          order.assigned_to && order.assigned_to.toString() === user?.user_id?.toString()
        )
        
        setDashboardData({
          orders: myDeliveries,
          loading: false
        })
      } else {
        // Redirect non-delivery users to appropriate dashboard
        window.location.href = '/dashboard/orders'
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Delivery Agent Dashboard
  if (user?.role === 'delivery') {
    const deliveryStats = {
      totalDeliveries: dashboardData.orders.length,
      pendingDeliveries: dashboardData.orders.filter(o => o.status === 'assigned').length,
      inTransit: dashboardData.orders.filter(o => o.status === 'in_transit').length,
      completed: dashboardData.orders.filter(o => o.status === 'delivered').length
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Deliveries</h1>
            <p className="text-muted-foreground">Track and manage your assigned deliveries.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/deliveries">View All Deliveries</Link>
          </Button>
        </div>

        {/* Delivery Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveryStats.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{deliveryStats.pendingDeliveries}</div>
              <p className="text-xs text-muted-foreground">Awaiting pickup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Navigation className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{deliveryStats.inTransit}</div>
              <p className="text-xs text-muted-foreground">On the way</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{deliveryStats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Order #{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                  <Badge className={`${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            {dashboardData.orders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No deliveries assigned yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // For non-delivery users, redirect to orders page
  return (
    <div className="flex items-center justify-center h-64">
      <div>Redirecting...</div>
    </div>
  )
}