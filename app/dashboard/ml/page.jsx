"use client"
import { withRoleAccess } from '@/hooks/useRoleAccess'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, TrendingUp, BarChart3, Calendar, Target, AlertCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'

function MLPage() {
  const [predictions, setPredictions] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    warehouse_id: '',
    product_id: '',
    days: '7'
  })
  const { token } = useAuth()

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const [warehousesData, productsData] = await Promise.all([
        apiFetch('/warehouses/', {}, token),
        apiFetch('/products/', {}, token)
      ])
      setWarehouses(warehousesData)
      setProducts(productsData)
    } catch (error) {
      toast.error('Failed to fetch options')
    }
  }

  const generateForecast = async () => {
    if (!formData.warehouse_id || !formData.product_id) {
      toast.error('Please select warehouse and product')
      return
    }

    setLoading(true)
    try {
      const result = await apiFetch('/ml/demand_forecast', {
        method: 'POST',
        body: JSON.stringify({
          warehouse_id: parseInt(formData.warehouse_id),
          product_id: parseInt(formData.product_id),
          days: parseInt(formData.days)
        })
      }, token)
      
      setPredictions(result.predictions)
      toast.success('Forecast generated successfully')
    } catch (error) {
      toast.error('Failed to generate forecast')
    } finally {
      setLoading(false)
    }
  }

  const totalPredictedDemand = predictions.reduce((sum, pred) => sum + pred.predicted_demand, 0)
  const avgDailyDemand = predictions.length > 0 ? totalPredictedDemand / predictions.length : 0
  const maxDemand = Math.max(...predictions.map(p => p.predicted_demand), 0)
  const minDemand = Math.min(...predictions.map(p => p.predicted_demand), 0)

  const selectedWarehouse = warehouses.find(w => w.id.toString() === formData.warehouse_id)
  const selectedProduct = products.find(p => p.id.toString() === formData.product_id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ML Insights</h1>
          <p className="text-muted-foreground">AI-powered demand forecasting and analytics</p>
        </div>
      </div>

      {/* Forecast Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Demand Forecasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
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
              <Label htmlFor="days">Forecast Days</Label>
              <Select value={formData.days} onValueChange={(value) => setFormData({...formData, days: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={generateForecast} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Forecast'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Results */}
      {predictions.length > 0 && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Demand</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPredictedDemand}</div>
                <p className="text-xs text-muted-foreground">Next {formData.days} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Daily Demand</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDailyDemand.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Units per day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
                <Target className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maxDemand}</div>
                <p className="text-xs text-muted-foreground">Highest predicted day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Demand</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{minDemand}</div>
                <p className="text-xs text-muted-foreground">Lowest predicted day</p>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Forecast Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct?.name} at {selectedWarehouse?.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.map((pred, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(pred.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{pred.predicted_demand}</div>
                        <div className="text-xs text-muted-foreground">units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demand Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 flex items-end justify-between gap-2">
                    {predictions.map((pred, index) => {
                      const height = (pred.predicted_demand / maxDemand) * 200
                      return (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div 
                            className="bg-blue-500 rounded-t-sm min-w-[20px] transition-all hover:bg-blue-600"
                            style={{ height: `${height}px` }}
                            title={`${pred.predicted_demand} units`}
                          />
                          <div className="text-xs text-muted-foreground transform -rotate-45 origin-center">
                            {new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Daily demand forecast for the next {formData.days} days
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700">Opportunities</h4>
                  <div className="space-y-2">
                    {avgDailyDemand > 5 && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">High Demand Expected</p>
                          <p className="text-xs text-muted-foreground">Consider increasing stock levels</p>
                        </div>
                      </div>
                    )}
                    {maxDemand - minDemand > 3 && (
                      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Variable Demand Pattern</p>
                          <p className="text-xs text-muted-foreground">Implement dynamic inventory management</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-700">Alerts</h4>
                  <div className="space-y-2">
                    {minDemand < 2 && (
                      <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Low Demand Period</p>
                          <p className="text-xs text-muted-foreground">Optimize inventory to reduce holding costs</p>
                        </div>
                      </div>
                    )}
                    {totalPredictedDemand > 50 && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                        <Target className="h-4 w-4 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">High Volume Alert</p>
                          <p className="text-xs text-muted-foreground">Ensure adequate supply chain capacity</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ML Model Information */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Brain className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Random Forest</h4>
              <p className="text-sm text-muted-foreground">Ensemble learning algorithm</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Features</h4>
              <p className="text-sm text-muted-foreground">Warehouse, Product, Time patterns</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">Accuracy</h4>
              <p className="text-sm text-muted-foreground">85% prediction accuracy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default withRoleAccess(MLPage, ['superadmin', 'manager'])