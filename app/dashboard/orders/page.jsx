"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
import { OrderStats } from '@/components/orders/OrderStats'
import { OrderFilters } from '@/components/orders/OrderFilters'
import { OrderTable } from '@/components/orders/OrderTable'
import { CreateOrderDialog } from '@/components/orders/CreateOrderDialog'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [deliveryUsers, setDeliveryUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { token } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [warehousesData, productsData, ordersData, deliveryData] = await Promise.all([
        apiFetch('/warehouses/', {}, token),
        apiFetch('/products/', {}, token),
        apiFetch('/orders/', {}, token),
        apiFetch('/orders/delivery-users/', {}, token)
      ])
      setWarehouses(warehousesData)
      setProducts(productsData)
      setOrders(ordersData)
      setDeliveryUsers(deliveryData)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const warehouse = warehouses.find(w => w.id === order.warehouse_id)
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         (warehouse?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        <CreateOrderDialog onSuccess={fetchData} />
      </div>

      <OrderStats orders={orders} />
      <OrderFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <OrderTable 
        orders={paginatedOrders}
        warehouses={warehouses}
        deliveryUsers={deliveryUsers}
        onUpdate={fetchData}
      />
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default withRoleAccess(OrdersPage, ['superadmin', 'manager'])