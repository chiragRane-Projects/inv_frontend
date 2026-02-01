"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Warehouse, MapPin, Search, Edit, Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { token, user } = useAuth()

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      const data = await apiFetch('/warehouses/', {}, token)
      setWarehouses(data)
    } catch (error) {
      toast.error('Failed to fetch warehouses')
    } finally {
      setLoading(false)
    }
  }

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const canCreateWarehouses = user?.role === 'superadmin'

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
          <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-muted-foreground">Manage your warehouse locations</p>
        </div>
        {canCreateWarehouses && <CreateWarehouseDialog onSuccess={fetchWarehouses} />}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search warehouses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map(warehouse => (
          <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                {warehouse.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {warehouse.location}
                </div>
                <div className="text-sm text-muted-foreground">
                  Capacity: {warehouse.capacity.toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {canCreateWarehouses && (
                    <>
                      <EditWarehouseDialog warehouse={warehouse} onSuccess={fetchWarehouses} />
                      <DeleteWarehouseButton warehouse={warehouse} onSuccess={fetchWarehouses} />
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CreateWarehouseDialog({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 1000
  })
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiFetch('/warehouses/', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          capacity: parseInt(formData.capacity)
        })
      }, token)
      
      toast.success('Warehouse created successfully')
      setOpen(false)
      setFormData({ name: '', location: '', capacity: 1000 })
      onSuccess()
    } catch (error) {
      toast.error('Failed to create warehouse')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Warehouse Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || 1000}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">Create Warehouse</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditWarehouseDialog({ warehouse, onSuccess }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: warehouse.name,
    location: warehouse.location,
    capacity: warehouse.capacity.toString()
  })
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiFetch(`/warehouses/${warehouse.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          capacity: parseInt(formData.capacity)
        })
      }, token)
      
      toast.success('Warehouse updated successfully')
      setOpen(false)
      onSuccess()
    } catch (error) {
      toast.error(`Failed to update warehouse: ${error.message}`)
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
          <DialogTitle>Edit Warehouse</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Warehouse Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">Update Warehouse</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteWarehouseButton({ warehouse, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${warehouse.name}"?`)) return
    
    setLoading(true)
    try {
      await apiFetch(`/warehouses/${warehouse.id}`, {
        method: 'DELETE'
      }, token)
      
      toast.success('Warehouse deleted successfully')
      onSuccess()
    } catch (error) {
      toast.error(`Failed to delete warehouse: ${error.message}`)
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

export default withRoleAccess(WarehousesPage, ['superadmin'])