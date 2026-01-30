import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { BarChart3, Truck, PackageCheck, Zap } from 'lucide-react'

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to run a <span className="text-blue-600">Smart Warehouse</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From procurement to last-mile delivery, manage your entire supply chain chain from a single dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card: Predictive Analytics */}
          <Card className="md:col-span-2 bg-slate-50 border-slate-200 overflow-hidden relative group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="text-blue-600" />
                Predictive Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-4">
                Our ML algorithms analyze historical data to predict stock shortages 7-14 days in advance.
              </p>
              <div className="h-48 w-full bg-white rounded-t-xl border border-slate-200 shadow-sm p-4 translate-y-4 group-hover:translate-y-2 transition-transform">
                <div className="flex gap-2 mb-2">
                  <div className="h-2 w-12 bg-slate-100 rounded-full"></div>
                  <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
                </div>
                <div className="h-24 w-full bg-blue-50/50 rounded-lg flex items-end gap-2 p-2">
                  <div className="w-full bg-blue-200 h-[40%] rounded-sm"></div>
                  <div className="w-full bg-blue-300 h-[70%] rounded-sm"></div>
                  <div className="w-full bg-blue-500 h-[50%] rounded-sm"></div>
                  <div className="w-full bg-blue-600 h-[90%] rounded-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Small Card 1: Fleet Tracking (UPDATED) */}
          <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="text-indigo-500" />
                Fleet Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm mb-4">
                Real-time GPS tracking for delivery boys with optimized route suggestions.
              </p>
              
              {/* Graphic: Abstract Map UI */}
              <div className="relative h-32 w-full bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                {/* Grid Pattern (Streets) */}
                <div className="absolute inset-0" 
                     style={{ 
                       backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', 
                       backgroundSize: '20px 20px' 
                     }}>
                </div>
                
                {/* Route Path */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none">
                  <path 
                    d="M 20 80 Q 80 20 140 50 T 240 40" 
                    fill="none" 
                    stroke="#6366f1" 
                    strokeWidth="3" 
                    strokeDasharray="4 4" 
                    strokeLinecap="round"
                  />
                </svg>

                {/* Start Point */}
                <div className="absolute top-[76px] left-[16px] h-2 w-2 bg-slate-400 rounded-full ring-2 ring-white"></div>
                
                {/* Current Location (Pulsing Dot) */}
                <div className="absolute top-[36px] right-[40px] h-3 w-3 bg-indigo-600 rounded-full ring-2 ring-white shadow-lg shadow-indigo-500/50">
                    <div className="absolute -inset-1 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                {/* Driver Tag */}
                <div className="absolute top-[20px] right-[50px] bg-white px-1.5 py-0.5 rounded text-[10px] font-bold text-indigo-600 shadow-sm border border-slate-100">
                  Van #4
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Small Card 2: Inventory Sync */}
          <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PackageCheck className="text-emerald-500" />
                Inventory Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-sm">
                Live stock updates across multiple warehouses. Never oversell again.
              </p>
            </CardContent>
          </Card>

           {/* Small Card 3: Instant Alerts */}
           <Card className="md:col-span-2 bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="text-amber-500" />
                Instant Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500">
                Get notified immediately via Email or SMS when stock levels hit critical thresholds.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Features