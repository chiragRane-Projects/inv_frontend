"use client" // Needed for Tabs state
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { CheckCircle2 } from 'lucide-react'

const RoleTabs = () => {
  return (
    <section id="solutions" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Built for every role in your team</h2>
          <p className="text-slate-600 mt-2">Specialized dashboards for maximum efficiency.</p>
        </div>

        <Tabs defaultValue="admin" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-200/50 p-1">
            <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Super Admin</TabsTrigger>
            <TabsTrigger value="manager" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Warehouse Manager</TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Delivery Agent</TabsTrigger>
          </TabsList>

          {/* Content Wrapper */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[300px] flex items-center">
            
            <TabsContent value="admin" className="grid md:grid-cols-2 gap-8 w-full mt-0">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Complete Oversight</h3>
                <p className="text-slate-600">Monitor the health of your entire logistics network from a bird's-eye view.</p>
                <ul className="space-y-2">
                  {['Global KPI Dashboard', 'Revenue & Order Analytics', 'User & Role Management'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
            </TabsContent>

            <TabsContent value="manager" className="grid md:grid-cols-2 gap-8 w-full mt-0">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Warehouse Efficiency</h3>
                <p className="text-slate-600">Keep shelves stocked and orders moving without the chaos.</p>
                <ul className="space-y-2">
                  {['Stock Level Monitoring', 'Inbound/Outbound Tracking', 'Auto-Reorder Triggers'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
             
            </TabsContent>

            <TabsContent value="delivery" className="grid md:grid-cols-2 gap-8 w-full mt-0">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">On-The-Go Operations</h3>
                <p className="text-slate-600">A mobile-first interface for agents on the road.</p>
                <ul className="space-y-2">
                  {['Optimized Route Maps', 'Digital Proof of Delivery', 'Real-time Status Updates'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </section>
  )
}

export default RoleTabs