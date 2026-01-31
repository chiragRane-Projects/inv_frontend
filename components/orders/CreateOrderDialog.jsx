import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

export function CreateOrderDialog({ onSuccess }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    warehouse_id: '',
    assigned_to: '',
    items: [{ product_id: '', quantity: '' }]
  })
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [deliveryUsers, setDeliveryUsers] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    if (open) {
      fetchOptions()
    }
  }, [open])

  const fetchOptions = async () => {
    try {
      const [warehousesData, productsData, deliveryData] = await Promise.all([
        apiFetch('/warehouses/', {}, token),
        apiFetch('/products/', {}, token),
        apiFetch('/orders/delivery-users/', {}, token)
      ])
      setWarehouses(warehousesData)
      setProducts(productsData)
      setDeliveryUsers(deliveryData)
    } catch (error) {
      toast.error('Failed to fetch options')
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: '' }]
    })
  }

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const payload = {
        warehouse_id: formData.warehouse_id.toString(),
        assigned_to: formData.assigned_to && formData.assigned_to !== 'none' ? parseInt(formData.assigned_to) : null,
        items: formData.items.map(item => ({
          product_id: item.product_id.toString(),
          quantity: item.quantity.toString()
        }))
      }
      
      await apiFetch('/orders/', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, token)
      
      toast.success('Order created successfully')
      setOpen(false)
      setFormData({ warehouse_id: '', assigned_to: '', items: [{ product_id: '', quantity: '' }] })
      onSuccess()
    } catch (error) {
      if (error.message.includes('Insufficient stock')) {
        toast.error('Order failed: Insufficient inventory. Please add inventory first.')
      } else {
        toast.error(`Failed to create order: ${error.message}`)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
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
            <Label htmlFor="delivery">Assign Delivery Agent (Optional)</Label>
            <Select value={formData.assigned_to} onValueChange={(value) => setFormData({...formData, assigned_to: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No assignment</SelectItem>
                {deliveryUsers.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Order Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Select 
                  value={item.product_id} 
                  onValueChange={(value) => updateItem(index, 'product_id', value)}
                >
                  <SelectTrigger className="flex-1">
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
                
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  className="w-20"
                />
                
                {formData.items.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <Button type="submit" className="w-full">Create Order</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}