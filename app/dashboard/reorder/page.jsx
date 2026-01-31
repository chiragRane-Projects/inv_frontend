"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Package, TrendingUp, RefreshCw } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

function ReorderPage() {
  const [recommendations, setRecommendations] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWarehouse, setSelectedWarehouse] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    console.log('🔄 Fetching reorder data...')
    try {
      const [warehousesData, productsData] = await Promise.all([
        apiFetch('/warehouses/', {}, token),
        apiFetch('/products/', {}, token)
      ])
      setWarehouses(warehousesData)
      setProducts(productsData)
      setRecommendations([]) // Start with empty recommendations
      console.log('✅ Reorder data loaded')
    } catch (error) {
      console.error('❌ Failed to fetch reorder data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const getRecommendation = async () => {
    if (!selectedWarehouse || !selectedProduct) {
      toast.error('Please select warehouse and product')
      return
    }

    try {
      const result = await apiFetch(
        `/reorder/recommendation?warehouse_id=${selectedWarehouse}&product_id=${selectedProduct}`,
        {},
        token
      )
      toast.success('Recommendation generated')
      // Add to recommendations list
      const newRec = {
        warehouse_id: parseInt(selectedWarehouse),
        warehouse_name: warehouses.find(w => w.id.toString() === selectedWarehouse)?.name || 'Unknown',
        product_id: parseInt(selectedProduct),
        product_name: products.find(p => p.id.toString() === selectedProduct)?.name || 'Unknown',
        current_stock: result.current_stock,
        reorder_level: result.reorder_point,
        recommended_quantity: result.recommended_quantity,
        urgency: result.recommended_quantity > 50 ? 'high' : result.recommended_quantity > 20 ? 'medium' : 'low',
        estimated_stockout_days: Math.ceil(result.current_stock / result.avg_daily_demand)
      }
      setRecommendations(prev => [newRec, ...prev])
    } catch (error) {
      toast.error('Failed to get recommendation. Make sure inventory exists for this warehouse-product combination.')
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Reorder Recommendations</h1>
          <p className="text-muted-foreground">AI-powered inventory reorder suggestions</p>
        </div>
      </div>

      {/* Generate Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Generate Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
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
            
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
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
            
            <Button onClick={getRecommendation}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Get Recommendation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground">Active suggestions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {recommendations.filter(r => r.urgency === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent reorders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommended Qty</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.reduce((sum, r) => sum + r.recommended_quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total units to order</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stockout Days</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations.length > 0 ? 
                Math.round(recommendations.reduce((sum, r) => sum + r.estimated_stockout_days, 0) / recommendations.length) : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">Days until stockout</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">{rec.product_name}</div>
                  <div className="text-sm text-muted-foreground">{rec.warehouse_name}</div>
                  <div className="text-sm">
                    Current: {rec.current_stock} | Reorder Level: {rec.reorder_level}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-lg font-bold">Order {rec.recommended_quantity} units</div>
                  <div className="flex gap-2">
                    <Badge className={getUrgencyColor(rec.urgency)}>
                      {rec.urgency} priority
                    </Badge>
                    <Badge variant="outline">
                      {rec.estimated_stockout_days} days left
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default withRoleAccess(ReorderPage, ['superadmin', 'manager'])