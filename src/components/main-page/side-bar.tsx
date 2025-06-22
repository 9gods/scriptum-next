"use client"

import { Folder, Star, Trash2, Plus, ChevronDown, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

const SIDEBAR_WIDTH = {
  collapsed: "w-16",
  expanded: "w-64"
}

const DROPDOWN_ITEMS = [
  { label: "Testes" },
  { label: "item.md" },
  { label: "item2.md" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleSidebar = () => setIsCollapsed(prev => !prev)
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown)
  }

  const renderLogo = () => (
    !isCollapsed && (
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="w-8 h-8">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-xl font-bold font-sans">Scriptum</h1>
      </div>
    )
  )

  const renderNewNoteButton = () => (
    <Link href={"/auth/notes/new"}>
      <Button
        variant={isCollapsed ? "ghost" : "outline"}
        size={isCollapsed ? "icon" : "default"}
        className={cn(
          "mb-4 gap-2 transition-colors",
          isCollapsed ? "justify-center" : "justify-start",
          "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <Plus className="h-4 w-4" />
        {!isCollapsed && "Nova Nota"}

      </Button>
    </Link>
  )

  const renderDropdownContent = () => (
    !isCollapsed && openDropdown === 'notas' && (
      <div className="relative ml-6">
        <div className="absolute left-0 top-0 h-full w-[0.5px] bg-gray-200 dark:bg-gray-700"></div>

        {DROPDOWN_ITEMS.map((item, index) => (
          <div key={item.label} className={`relative pl-2 group ${index > 0 ? 'mt-0.5' : ''}`}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[1.5px] bg-transparent 
                          group-hover:bg-gray-400 dark:group-hover:bg-purple-500 transition-colors"></div>
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1 hover:bg-transparent dark:hover:bg-transparent text-sm h-8"
            >
              {item.label}
            </Button>
          </div>
        ))}
      </div>
    )
  )

  const renderNavItem = ({ icon: Icon, label, hasDropdown = false }: {
    icon: React.ComponentType<{ className?: string }>,
    label: string,
    hasDropdown?: boolean
  }) => (
    <div className="relative">
      <Button
        variant="ghost"
        size={isCollapsed ? "icon" : "default"}
        className={cn(
          "w-full gap-2 transition-colors",
          isCollapsed ? "justify-center" : hasDropdown ? "justify-between" : "justify-start",
          "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        onClick={hasDropdown ? () => toggleDropdown('notas') : undefined}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {!isCollapsed && label}
        </div>
        {!isCollapsed && hasDropdown && (
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            openDropdown === 'notas' ? "rotate-180" : ""
          )} />
        )}
      </Button>
      {hasDropdown && renderDropdownContent()}
    </div>
  )

  const renderFooter = () => (
    <div className={cn(
      "mt-auto pt-4 border-t",
      isCollapsed ? "px-1" : "px-3"
    )}>
      {!isCollapsed ? (
        <>
          <div className="text-sm text-muted-foreground mb-2">Armazenamento: 15%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
          </div>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="w-full justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  return (
    <div className={cn(
      "h-screen bg-background border-r flex flex-col",
      "transition-all duration-300 ease-in-out",
      isCollapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded
    )}>
      <div className="p-2 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2 flex flex-col h-full">
        {renderLogo()}
        {renderNewNoteButton()}

        <nav className="flex-1 space-y-1">
          {renderNavItem({ icon: Folder, label: "Nova Pasta", hasDropdown: true })}
          {renderNavItem({ icon: Star, label: "Todas as Notas" })}
          {renderNavItem({ icon: Star, label: "Notas Recentes" })}
          {renderNavItem({ icon: Star, label: "Favoritos" })}
          {renderNavItem({ icon: Trash2, label: "Lixeira" })}
        </nav>

        {renderFooter()}
      </div>
    </div>
  )
}