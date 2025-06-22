"use client"
import { Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '../mode-toggle'

export function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="">
      <Button 
        variant="ghost" 
        size="icon" 
        className="mr-2 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
    </header>
  )
}