'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reserveEvent } from '../lib/actions'
import { acquireSemaphore, releaseSemaphore } from '../config/semaphore'
import { Event } from '@/model/event'

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [isReserving, setIsReserving] = useState(false)
  const [reservationTimer, setReservationTimer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isReserving && reservationTimer) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, reservationTimer - now);
        setTimeLeft(Math.floor(remaining / 1000));
        if (remaining <= 0) {
          setIsReserving(false);
          setReservationTimer(null);
          setTimeLeft(null);
          handleRelease();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReserving, reservationTimer]);  

  const handleReserve = async () => {
    await acquireSemaphore()

    setIsReserving(true)

    const expirationTime = Date.now() + 5000; // 2 minutes from now
    setReservationTimer(expirationTime)

    try {
      await reserveEvent(event.id)
      // Handle successful reservation
    } catch (error) {
      console.error('Erro ao reservar:', error)
      setIsReserving(false)
      setReservationTimer(null)
      setTimeLeft(null)
      handleRelease()
    }
  }

  const handleRelease = () => {
    releaseSemaphore()
    setIsReserving(false)
    setReservationTimer(null)
    setTimeLeft(null)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Vagas disponíveis: {event.availableSlots}</p>
        {isReserving && timeLeft !== null && (
          <p>Tempo restante para confirmar: {timeLeft} segundos</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleReserve} disabled={isReserving || event.availableSlots === 0}>
          {isReserving ? 'Confirmando...' : 'Reservar'}
        </Button>
      </CardFooter>
    </Card>
  )
}