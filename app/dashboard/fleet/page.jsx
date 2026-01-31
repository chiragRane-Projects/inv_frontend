"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Truck, MapPin, Clock, Fuel, AlertTriangle, CheckCircle, Search, Navigation } from 'lucide-react'

export default function FleetPage() {
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Generate mock fleet data
    const mockVehicles = Array.from({ length: 12 }, (_, i) => ({
      id: `VH-${String(i + 1).padStart(3, '0')}`,
      driver: `Driver ${i + 1}`,
      type: ['Truck', 'Van', 'Trailer'][Math.floor(Math.random() * 3)],
      status: ['active', 'idle', 'maintenance', 'loading'][Math.floor(Math.random() * 4)],
      location: [
        'Downtown Warehouse',
        'Port Terminal',
        'Distribution Center A',
        'Customer Site',
        'Fuel Station',
        'Maintenance Depot'
      ][Math.floor(Math.random() * 6)],
      destination: [
        'Customer Location A',
        'Warehouse B',
        'Distribution Hub',
        'Retail Store',
        'Manufacturing Plant'
      ][Math.floor(Math.random() * 5)],
      progress: Math.floor(Math.random() * 100),
      eta: new Date(Date.now() + Math.random() * 8 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fuel: Math.floor(Math.random() * 100),
      mileage: Math.floor(Math.random() * 50000) + 10000,
      lastUpdate: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }))
    setVehicles(mockVehicles)
  }, [])

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Navigation className="h-4 w-4" />
      case 'idle': return <Clock className="h-4 w-4" />
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />
      case 'loading': return <Truck className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'idle': return 'bg-yellow-100 text-yellow-800'
      case 'maintenance': return 'bg-red-100 text-red-800'
      case 'loading': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getFuelColor = (fuel) => {
    if (fuel > 50) return 'text-green-600'
    if (fuel > 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const fleetStats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    idle: vehicles.filter(v => v.status === 'idle').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    avgFuel: vehicles.reduce((sum, v) => sum + v.fuel, 0) / vehicles.length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Tracking</h1>
          <p className="text-muted-foreground">Monitor and manage your vehicle fleet in real-time</p>
        </div>
        <Button onClick={() => window.open('https://maps.google.com', '_blank')}>
          <MapPin className="h-4 w-4 mr-2" />
          View Map
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.total}</div>
            <p className="text-xs text-muted-foreground">Fleet size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            <Navigation className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fleetStats.active}</div>
            <p className="text-xs text-muted-foreground">Currently on route</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idle Vehicles</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{fleetStats.idle}</div>
            <p className="text-xs text-muted-foreground">Available for dispatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Fuel Level</CardTitle>
            <Fuel className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.avgFuel.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Fleet average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="loading">Loading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fleet Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map(vehicle => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vehicle.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(vehicle.status)}
                    {vehicle.status}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Current:</span>
                  <span className="text-muted-foreground">{vehicle.location}</span>
                </div>
                
                {vehicle.status === 'active' && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Destination:</span>
                      <span className="text-muted-foreground">{vehicle.destination}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{vehicle.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${vehicle.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">ETA:</span>
                      <span className="text-muted-foreground">{vehicle.eta}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fuel:</span>
                  <span className={getFuelColor(vehicle.fuel)}>{vehicle.fuel}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated: {vehicle.lastUpdate}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(vehicle.location)}`, '_blank')}>Track</Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`tel:+1234567890`, '_blank')}>Contact</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Maintenance Alerts */}
      {fleetStats.maintenance > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vehicles.filter(v => v.status === 'maintenance').map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <span className="font-medium">{vehicle.id}</span>
                    <span className="text-muted-foreground ml-2">- {vehicle.driver}</span>
                  </div>
                  <Badge variant="destructive">Maintenance Required</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Fuel Alerts */}
      {vehicles.filter(v => v.fuel < 25).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Fuel className="h-5 w-5" />
              Low Fuel Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {vehicles.filter(v => v.fuel < 25).map(vehicle => (
                <div key={vehicle.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div>
                    <span className="font-medium">{vehicle.id}</span>
                    <span className="text-muted-foreground ml-2">- {vehicle.location}</span>
                  </div>
                  <Badge variant="destructive">{vehicle.fuel}% Fuel</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}