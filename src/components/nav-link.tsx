'use client'

import React, { ComponentProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavLinkProps = ComponentProps<typeof Link>

export function NavLink(props: NavLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      {...props}
      data-current={pathname === props.href}

      className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground data-[current=true]:text-primary"
    />
  )
}
