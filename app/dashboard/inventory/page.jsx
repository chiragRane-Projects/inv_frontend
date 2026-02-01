"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Package, AlertTriangle, TrendingUp, Search, Edit, Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

function InventoryPage() {
  const [inventory, setInventory] = useState([])
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const { token } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    console.log('🔄 Fetching inventory data...')
    try {
      const [productsData, warehousesData, inventoryData] = await Promise.all([
        apiFetch('/products/', {}, token),
        apiFetch('/warehouses/', {}, token),
        apiFetch('/inventory/', {}, token)
      ])
      setProducts(productsData)
      setWarehouses(warehousesData)
      setInventory(inventoryData)
      console.log('✅ All real inventory data loaded')
    } catch (error) {
      console.error('❌ Failed to fetch inventory data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const filteredInventory = inventory.filter(item => {
    const product = products.find(p => p.id === item.product_id)
    const warehouse = warehouses.find(w => w.id === item.warehouse_id)
    
    const matchesSearch = (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (warehouse?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWarehouse = selectedWarehouse === 'all' || item.warehouse_id.toString() === selectedWarehouse
    return matchesSearch && matchesWarehouse
  })

  const lowStockItems = inventory.filter(item => item.quantity <= item.reorder_level)
  const totalValue = inventory.reduce((sum, item) => {
    const product = products.find(p => p.id === item.product_id)
    return sum + ((item.quantity || 0) * (product?.unit_price || 0))
  }, 0)

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
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and manage your warehouse inventory</p>
        </div>
        <AddInventoryDialog onSuccess={fetchData} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all warehouses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Products</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Different product types</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products or warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {warehouses.map(warehouse => (
              <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                {warehouse.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Warehouse</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Reorder Level</th>
                  <th className="text-right p-2">Unit Price</th>
                  <th className="text-right p-2">Total Value</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const product = products.find(p => p.id === item.product_id)
                  const warehouse = warehouses.find(w => w.id === item.warehouse_id)
                  
                  return (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{product?.name || 'Unknown Product'}</td>
                    <td className="p-2 text-muted-foreground">{warehouse?.name || 'Unknown Warehouse'}</td>
                    <td className="p-2">
                      <Badge variant="outline">{product?.category || 'N/A'}</Badge>
                    </td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">{item.reorder_level}</td>
                    <td className="p-2 text-right">${product?.unit_price || 0}</td>
                    <td className="p-2 text-right">${((item.quantity || 0) * (product?.unit_price || 0)).toFixed(2)}</td>
                    <td className="p-2 text-center">
                      {item.quantity <= item.reorder_level ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : item.quantity <= item.reorder_level * 2 ? (
                        <Badge variant="secondary">Medium</Badge>
                      ) : (
                        <Badge variant="default" className="bg-green-100 text-green-800">Good</Badge>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex gap-1 justify-center">
                        <EditInventoryDialog item={item} onSuccess={fetchData} />
                        <DeleteInventoryButton item={item} onSuccess={fetchData} />
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddInventoryDialog({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    warehouse_id: '',
    product_id: '',
    quantity: '',
    reorder_level: ''
  })
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (open) {
      fetchOptions()
    }
  }, [open])

  const fetchOptions = async () => {
    try {
      const [productsData, warehousesData] = await Promise.all([
        apiFetch('/products/', {}, token),
        apiFetch('/warehouses/', {}, token)
      ])
      setProducts(productsData)
      setWarehouses(warehousesData)
    } catch (error) {
      toast.error('Failed to fetch options')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📦 Creating inventory with form data:', formData)
    
    try {
      const payload = {
        warehouse_id: formData.warehouse_id.toString(),
        product_id: formData.product_id.toString(),
        quantity: formData.quantity.toString(),
        reorder_level: formData.reorder_level.toString()
      }
      
      console.log('📤 Inventory payload:', payload)
      
      await apiFetch('/inventory/', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, token)
      
      toast.success('Inventory item added successfully')
      setOpen(false)
      setFormData({ warehouse_id: '', product_id: '', quantity: '', reorder_level: '' })
      onSuccess()
    } catch (error) {
      console.error('❌ Inventory creation failed:', error)
      toast.error(`Failed to add inventory: ${error.message}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select value={formData.warehouse_id} onValueChange={(value) => setFormData({...formData, warehouse_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="product">Product</Label>
            <Select value={formData.product_id} onValueChange={(value) => setFormData({...formData, product_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="reorder_level">Reorder Level</Label>
            <Input
              id="reorder_level"
              type="number"
              value={formData.reorder_level}
              onChange={(e) => setFormData({...formData, reorder_level: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">Add Inventory Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditInventoryDialog({ item, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    warehouse_id: item.warehouse_id.toString(),
    product_id: item.product_id.toString(),
    quantity: item.quantity.toString(),
    reorder_level: item.reorder_level.toString()
  })
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (open) {
      fetchOptions()
    }
  }, [open])

  const fetchOptions = async () => {
    try {
      const [productsData, warehousesData] = await Promise.all([
        apiFetch('/products/', {}, token),
        apiFetch('/warehouses/', {}, token)
      ])
      setProducts(productsData)
      setWarehouses(warehousesData)
    } catch (error) {
      toast.error('Failed to fetch options')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        warehouse_id: parseInt(formData.warehouse_id),
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorder_level)
      }
      
      await apiFetch(`/inventory/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }, token)
      
      toast.success('Inventory updated successfully')
      setOpen(false)
      onSuccess()
    } catch (error) {
      toast.error(`Failed to update inventory: ${error.message}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select value={formData.warehouse_id} onValueChange={(value) => setFormData({...formData, warehouse_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="product">Product</Label>
            <Select value={formData.product_id} onValueChange={(value) => setFormData({...formData, product_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="reorder_level">Reorder Level</Label>
            <Input
              id="reorder_level"
              type="number"
              value={formData.reorder_level}
              onChange={(e) => setFormData({...formData, reorder_level: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">Update Inventory</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteInventoryButton({ item, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return
    
    setLoading(true)
    try {
      await apiFetch(`/inventory/${item.id}`, {
        method: 'DELETE'
      }, token)
      
      toast.success('Inventory item deleted successfully')
      onSuccess()
    } catch (error) {
      toast.error(`Failed to delete inventory: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-700"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
export default withRoleAccess(InventoryPage, ['superadmin', 'manager'])