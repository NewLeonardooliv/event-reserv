'use client'

import { useEffect, useState } from "react"
import EventCard from "@/components/EventCard"
import { Event } from "@/model/event"
import { useSocket } from "@/hooks/useSocket"
import { getEvents } from "@/http/getEvents"

export const EventList = ({ isActive, setDialogIsOpen }: { isActive: boolean, setDialogIsOpen: (value: boolean) => void }) => {
    useEffect(() => {
        const fetchData = async () => {
            const eventsGetter = await getEvents()

            setEventsList(eventsGetter)
        }

        fetchData()
    }, [])

    const [eventsList, setEventsList] = useState<Event[]>([])
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
                <EventCard isActive={isActive} key={event.id} event={event} setDialogIsOpen={setDialogIsOpen} />
            ))}
        </>
    )
}

export default EventList