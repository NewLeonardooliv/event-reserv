'use client'

import { useEffect, useState } from "react"
import EventCard from "@/components/EventCard"
import { Event } from "@/model/event"
import { useSocket } from "@/hooks/useSocket"

export const EventList = ({ initialEvents }: { initialEvents: Event[] }) => {
    const [eventsList, setEventsList] = useState<Event[]>(initialEvents)
    const socket = useSocket()

    useEffect(() => {
        if (socket) {
            socket.on('receive-event', (newEvent: Event) => {
                console.log(newEvent);

                setEventsList((prevEvents) => [...prevEvents, newEvent])
            })

            return () => {
                socket.off('receive-event')
            }
        }
    }, [socket])

    return (
        <>
            {eventsList.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </>
    )
}

export default EventList