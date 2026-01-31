import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Clock, CheckCircle, XCircle, ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import { OrderDetailsSheet } from './OrderDetailsSheet'

export function OrderTable({ orders, warehouses, deliveryUsers, onUpdate }) {
  const [selectedOrder, setSelectedOrder] = useState(null)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'created': return <Clock className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      case 'shipped': return <ShoppingCart className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Warehouse</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Items</th>
                <th className="text-right p-2">Total Amount</th>
                <th className="text-center p-2">Status</th>
                <th className="text-center p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const warehouse = warehouses.find(w => w.id === order.warehouse_id)
                
                return (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="p-2 font-medium">#{order.id}</td>
                  <td className="p-2 text-muted-foreground">{warehouse?.name || 'Unknown Warehouse'}</td>
                  <td className="p-2">{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'No date'}</td>
                  <td className="p-2">
                    <div className="text-sm">
                      <div>Order Items</div>
                      <div className="text-muted-foreground">View details for items</div>
                    </div>
                  </td>
                  <td className="p-2 text-right font-medium">
                    ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                  </td>
                  <td className="p-2 text-center">
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </td>
                  <td className="p-2 text-center">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[500px] sm:w-[600px] p-0 overflow-y-auto">
                        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-gray-50 sticky top-0 z-10">
                          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Order #{order.id}
                          </SheetTitle>
                        </SheetHeader>
                        <div className="px-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                          <OrderDetailsSheet order={selectedOrder} deliveryUsers={deliveryUsers} onUpdate={onUpdate} />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}