import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User, Truck, Package, CheckCircle2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export function OrderDetailsSheet({ order, deliveryUsers, onUpdate }) {
  const [assignedTo, setAssignedTo] = useState(order?.assigned_to?.toString() || '')
  const [status, setStatus] = useState(order?.status || '')
  const [orderItems, setOrderItems] = useState([])
  const { token, user } = useAuth()

  useEffect(() => {
    if (order?.id && (user?.role === 'superadmin' || user?.role === 'manager')) {
      fetchOrderItems()
    }
  }, [order?.id, user?.role])

  const fetchOrderItems = async () => {
    try {
      const items = await apiFetch(`/orders/${order.id}/items`, {}, token)
      setOrderItems(items)
    } catch (error) {
      console.error('Failed to fetch order items:', error)
    }
  }

  const handleAssign = async () => {
    if (!assignedTo) return
    try {
      await apiFetch(`/orders/${order.id}/assign/${assignedTo}`, { method: 'PUT' }, token)
      toast.success('Order assigned successfully')
      onUpdate()
    } catch (error) {
      toast.error('Failed to assign order')
    }
  }

  const handleStatusUpdate = async () => {
    try {
      await apiFetch(`/orders/${order.id}/status/${status}`, { method: 'PUT' }, token)
      toast.success('Status updated successfully')
      onUpdate()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'picked_up': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_transit': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!order) return null

  return (
    <div className="space-y-6 py-4">
      {/* Order Info Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
            </div>
            <Badge className={`${getStatusColor(order.status)} border`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {order.order_date ? new Date(order.order_date).toLocaleString() : 'No date'}
              </span>
            </div>
            
            {order.assigned_to && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to:</span>
                <span className="font-medium">
                  {deliveryUsers.find(u => u.id === order.assigned_to)?.name || 'Unknown'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Order Items - Only for superadmin and manager */}
      {(user?.role === 'superadmin' || user?.role === 'manager') && (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold">Order Items</h4>
            </div>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-amber-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {orderItems.length > 0 ? (
                    <>
                      <div className="grid gap-2">
                        <div className="flex justify-between items-center p-2 bg-white rounded border font-semibold text-sm">
                          <span>Product Name</span>
                          <span>Quantity</span>
                        </div>
                        {orderItems.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-white rounded border hover:bg-gray-50">
                            <span className="font-medium">{item.product_name || 'Unknown Product'}</span>
                            <span className="text-lg font-bold text-blue-600">{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        Total items: {orderItems.length}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Loading order items...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
        </>
      )}

      {/* Status Management */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold">Status Management</h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Update Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleStatusUpdate} 
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Update Status
          </Button>
        </div>
      </div>

      <Separator />

      {/* Delivery Assignment */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="h-5 w-5 text-blue-600" />
          <h4 className="font-semibold">Delivery Assignment</h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Assign Delivery Agent</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select delivery agent" />
              </SelectTrigger>
              <SelectContent>
                {deliveryUsers.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <span className="text-muted-foreground">({user.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAssign} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="sm"
            disabled={!assignedTo}
          >
            <Truck className="h-4 w-4 mr-2" />
            Assign Order
          </Button>
        </div>
      </div>
    </div>
  )
}