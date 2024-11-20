'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reserveEvent } from '../lib/actions'
import { acquireSemaphore, releaseSemaphore } from '../config/semaphore'
import { Event } from '@/model/event'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EventCardProps {
  event: Event; 
}

export default function EventCard({ event }: EventCardProps) {
  const [reservationTimer, setReservationTimer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (reservationTimer) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, reservationTimer - now);
        setTimeLeft(Math.floor(remaining / 1000));
        if (remaining <= 0) {
          setReservationTimer(null);
          setTimeLeft(null);
          handleRelease();
        }
      }, 0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reservationTimer]);  

  const handleReserve = async () => {
    const expirationTime = Date.now() + 121000 // 2 minutes from now
    setReservationTimer(expirationTime)
    await acquireSemaphore() 
    setIsDialogOpen(true)  
  };

  const confirmReservation = async () => {
    setIsDialogOpen(false)        
    setReservationTimer(null)      
    handleRelease()
    try {
      await reserveEvent(event.id)      
    } catch (error) {
      console.error('Erro ao reservar:', error)
      setReservationTimer(null)
      setTimeLeft(null)      
    }
  }

  const handleRelease = async () => {
    await releaseSemaphore()
    setReservationTimer(null)
    setIsDialogOpen(false)
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vagas disponíveis: {event.availableSlots}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReserve} disabled={event.availableSlots === 0}>
            Reservar
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent
          timer={timeLeft !== null ? `${timeLeft} segundos restantes` : null}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Informe seu nome e telefone para confirmar sua inscrição no evento
              <br />
              <strong>{event.name}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Seu nome"
              className="border rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Seu telefone"
              className="border rounded px-3 py-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmReservation}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}