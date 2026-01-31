"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, CheckCircle, Package, Navigation } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, user } = useAuth()

  useEffect(() => {
    fetchDeliveries()
  }, [])

  const fetchDeliveries = async () => {
    try {
      const [ordersData, warehousesData] = await Promise.all([
        apiFetch('/orders/', {}, token),
        apiFetch('/warehouses/', {}, token)
      ])
      
      // Filter orders assigned to current delivery agent
      const myDeliveries = ordersData.filter(order => 
        order.assigned_to && order.assigned_to.toString() === user?.user_id?.toString()
      )
      
      setDeliveries(myDeliveries)
      setWarehouses(warehousesData)
    } catch (error) {
      toast.error('Failed to fetch deliveries')
    } finally {
      setLoading(false)
    }
  }

  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      await apiFetch(`/orders/${orderId}/status/${newStatus}`, { method: 'PUT' }, token)
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === orderId ? { ...delivery, status: newStatus } : delivery
      ))
      toast.success(`Delivery status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned': return <Clock className="h-4 w-4" />
      case 'picked_up': return <Package className="h-4 w-4" />
      case 'in_transit': return <Navigation className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'picked_up': return 'bg-yellow-100 text-yellow-800'
      case 'in_transit': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const deliveryStats = {
    total: deliveries.length,
    assigned: deliveries.filter(d => d.status === 'assigned').length,
    in_transit: deliveries.filter(d => d.status === 'in_transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Deliveries</h1>
          <p className="text-muted-foreground">Manage your assigned deliveries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.total}</div>
            <p className="text-xs text-muted-foreground">Today's assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{deliveryStats.assigned}</div>
            <p className="text-xs text-muted-foreground">Awaiting pickup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Navigation className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{deliveryStats.in_transit}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveryStats.delivered}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {deliveries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Deliveries Assigned</h3>
              <p className="text-muted-foreground">You don't have any deliveries assigned to you yet.</p>
            </CardContent>
          </Card>
        ) : (
          deliveries.map(delivery => {
            const warehouse = warehouses.find(w => w.id === delivery.warehouse_id)
            
            return (
            <Card key={delivery.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{delivery.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{warehouse?.name || 'Unknown Warehouse'}</p>
                  </div>
                  <Badge className={getStatusColor(delivery.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(delivery.status)}
                      {delivery.status.replace('_', ' ')}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{warehouse?.address || 'Warehouse Address'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Order Date: {delivery.order_date ? new Date(delivery.order_date).toLocaleDateString() : 'No date'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Amount: </span>
                    <span>${delivery.total_amount ? delivery.total_amount.toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Status: </span>
                    <span className="capitalize">{delivery.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {delivery.status === 'assigned' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateDeliveryStatus(delivery.id, 'picked_up')}
                    >
                      Mark as Picked Up
                    </Button>
                  )}
                  {delivery.status === 'picked_up' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateDeliveryStatus(delivery.id, 'in_transit')}
                    >
                      Start Delivery
                    </Button>
                  )}
                  {delivery.status === 'in_transit' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateDeliveryStatus(delivery.id, 'delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => {
                    // Navigate to order details page
                    window.open(`/dashboard/orders/${delivery.id}`, '_blank')
                  }}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
export default withRoleAccess(DeliveriesPage, ['delivery'])