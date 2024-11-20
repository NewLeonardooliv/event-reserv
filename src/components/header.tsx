'use client'

import { Component, PartyPopper, Shield } from 'lucide-react'

import { NavLink } from './nav-link'
import { Separator } from './ui/separator'
import { ModeToggle } from './theme-toggle'

export function Header() {
  const menuItems = [
    { id: '/', icon: Component, label: 'Eventos' },
    { id: '/admin', icon: Shield, label: 'Admin' },
  ]

  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <PartyPopper className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          {menuItems.map((item) => (
            <NavLink key={item.id} href={item.id}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
