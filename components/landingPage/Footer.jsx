import React from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Left Side: Copyright & Branding */}
        <div className="text-center md:text-left">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SmartLogistics. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Developed by{' '}
            <Link 
              href="https://chirag-v-rane.vercel.app/" 
              target="_blank" 
              className="hover:text-blue-600 hover:underline transition-colors font-medium"
            >
              Chirag Vaibhav Rane
            </Link>
          </p>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex items-center gap-6">
          <Link 
            href="https://github.com/chiragRane-Projects" 
            target="_blank"
            className="text-slate-400 hover:text-slate-900 transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </Link>

          <Link 
            href="https://www.linkedin.com/in/chirag-v-rane/" 
            target="_blank"
            className="text-slate-400 hover:text-blue-700 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </Link>

          <Link 
            href="mailto:beingchirag6@gmail.com" 
            className="text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer