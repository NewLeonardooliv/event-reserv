'use client'

import UsersList from '../components/UsersList'
import { EventList } from './_components/EventList';
import { useState } from 'react';

export default function Home() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Eventos Disponíveis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventList isActive={isActive} />
        </div>
      </main>
      <UsersList isActive={isActive} setIsActive={setIsActive} />
    </div>
  )
}