import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Link from 'next/link'
import { GithubIcon, Globe, ArrowRight } from 'lucide-react' 

const Hero = () => {
  return (
    <section className='relative border-b bg-slate-50/50 overflow-hidden'>
  
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-cyan-400 opacity-20 blur-[100px]"></div>
        </div>

        <div className='container mx-auto px-4 py-20 flex flex-col items-center gap-6 relative z-10'>
            
            <Badge className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 border-none shadow-sm">
                <span className='font-bold text-white text-xs tracking-wide uppercase'>
                    New AI-Powered Routing
                </span>
            </Badge>

            <h1 className='font-bold text-center text-4xl md:text-7xl tracking-tighter text-slate-900 leading-[1.1]'>
                Modern Logistics, <br className="hidden md:block" /> 
                Managed with{' '}
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600'>
                    Intelligence
                </span>
            </h1>

            <p className='text-slate-500 text-center text-lg max-w-2xl'>
                Streamline your supply chain with our next-generation fleet management dashboard. 
            </p>

            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <Button asChild variant="outline" className="cursor-pointer border-slate-300 hover:bg-slate-100 hover:text-slate-900 min-w-40 h-11">
                    <Link href="https://github.com/chiragRane-Projects/inv_frontend.git" target="_blank">
                        <GithubIcon className="mr-2 h-4 w-4"/>
                        <span>Source Code</span>
                    </Link>
                </Button>

                <Button asChild className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 min-w-40 h-11">
                    <Link href="https://chirag-v-rane.vercel.app/" target="_blank">
                        <Globe className="mr-2 h-4 w-4"/>
                        <span>Visit My Portfolio</span>
                        <ArrowRight className="ml-2 h-4 w-4 opacity-70" />
                    </Link>
                </Button>
            </div>
        </div>
    </section>
  )
}

export default Hero