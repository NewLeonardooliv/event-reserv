'use client'

import { useEffect, useState } from "react"
import EventCard from "@/components/EventCard"
import { Event } from "@/model/event"
import { useSocket } from "@/hooks/useSocket"

export const EventList = ({ initialEvents }: { initialEvents: Event[] }) => {
    const [eventsList, setEventsList] = useState<Event[]>(initialEvents)
    const socket = useSocket()

    useEffect(() => {
        if (!socket) return;

        socket.on('receive-event', (newEvent) => {
             setEventsList((prevEvents) => [...prevEvents, newEvent as Event])
        })

        socket.on('receive-event-att', (updatedEvent: { eventId: string; availableSlots: number }) => {        
            setEventsList((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedEvent.eventId
                        ? { ...event, availableSlots: updatedEvent.availableSlots }
                        : event
                )
            );
        })

        return () => {
            socket.off('receive-event')
            socket.off('receive-event-att')
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