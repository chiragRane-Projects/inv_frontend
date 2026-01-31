"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  AlertTriangle,
  Users,
  DollarSign,
  Activity,
  Truck,
  Clock,
  CheckCircle,
  Navigation
} from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    products: [],
    warehouses: [],
    orders: [],
    inventory: [],
    users: [],
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
          products: [],
          warehouses: [],
          orders: myDeliveries,
          inventory: [],
          users: [],
          loading: false
        })
      } else {
        const [productsData, warehousesData, ordersData, inventoryData, usersData] = await Promise.all([
          apiFetch('/products/', {}, token),
          apiFetch('/warehouses/', {}, token),
          apiFetch('/orders/', {}, token),
          apiFetch('/inventory/', {}, token),
          apiFetch('/auth/users', {}, token)
        ])
        
        setDashboardData({
          products: productsData,
          warehouses: warehousesData,
          orders: ordersData,
          inventory: inventoryData,
          users: usersData,
          loading: false
        })
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
            <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-muted-foreground">Track your delivery assignments and performance.</p>
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

  const stats = {
    totalOrders: dashboardData.orders.length,
    totalRevenue: dashboardData.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    totalProducts: dashboardData.products.length,
    totalWarehouses: dashboardData.warehouses.length,
    totalUsers: dashboardData.users.length,
    totalInventoryValue: dashboardData.inventory.reduce((sum, item) => {
      const product = dashboardData.products.find(p => p.id === item.product_id)
      return sum + ((item.quantity || 0) * (product?.unit_price || 0))
    }, 0),
    lowStockItems: dashboardData.inventory.filter(item => item.quantity <= item.reorder_level).length,
    pendingOrders: dashboardData.orders.filter(order => 
      ['created', 'processing'].includes(order.status)
    ).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete overview of your logistics platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/ml">View Insights</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/orders">Manage Orders</Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-600" />
              -2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active platform users</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{stats.lowStockItems}</div>
            <p className="text-sm text-orange-600">Items need reordering</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/dashboard/inventory">View Inventory</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Platform Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
            <p className="text-sm text-muted-foreground">Active warehouses</p>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Capacity</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-sm text-muted-foreground">Awaiting processing</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/dashboard/orders">Process Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/warehouses">
                <Warehouse className="h-6 w-6 mb-2" />
                Manage Warehouses
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/products">
                <Package className="h-6 w-6 mb-2" />
                Manage Products
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/ml">
                <BarChart3 className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default withRoleAccess(DashboardPage, ['superadmin', 'delivery'])