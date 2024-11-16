import { getEvents, getOnlineUsers, getWaitingList } from '@/lib/data';
import EventCard from '../components/EventCard'
import UsersList from '../components/UsersList'

interface Event {
  id: string;
  name: string;
  availableSlots: number;
}

interface User {
  id: string;
  name: string;
}

export default async function Home() {
  const events: Event[] = await getEvents()
  const onlineUsers: User[] = await getOnlineUsers()
  const waitingList: User[] = await getWaitingList()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Eventos Disponíveis</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
      <UsersList onlineUsers={onlineUsers} waitingList={waitingList} />
    </div>
  )
}