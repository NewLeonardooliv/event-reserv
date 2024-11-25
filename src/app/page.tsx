import { getEvents } from '@/lib/data';
import UsersList from '../components/UsersList'
import { Event } from '@/model/event';
import { EventList } from './_components/EventList';


export default async function Home() {
  const events: Event[] = await getEvents()

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Eventos Disponíveis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventList initialEvents={events} />
        </div>
      </main>
      <UsersList />
    </div>
  )
}