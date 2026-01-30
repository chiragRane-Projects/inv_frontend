import React from 'react'
import { Button } from '../ui/button'
import { Lock } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='p-4 border-b'>
      <div className='flex flex-row justify-between items-center'>
        <p className='font-bold text-xl text-zinc-800'>Smart Logistics</p>
        
        <Button asChild className={"bg-transparent border border-zinc-600 text-zinc-800 hover:bg-transparent rounded-sm"}>
          <Link href="/login" className='flex flex-row gap-2'>
            <Lock size={20} />
            <span>Login</span>
          </Link>
        </Button>

      </div>
    </header>
  )
}

export default Header