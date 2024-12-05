'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { acquireSemaphore, releaseSemaphore } from '../config/semaphore';
import { Event } from '@/model/event';
import { patchEvent } from '@/http/patchEvents';
import { useSocket } from '@/hooks/useSocket';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EventCardProps {
  event: Event;
  isActive: boolean
}

export default function EventCard({ event, isActive }: EventCardProps) {
  const [reservationTimer, setReservationTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const socket = useSocket();

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
          handleCancelReservation(); 
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reservationTimer]);

  const handleReserve = async () => {
    const expirationTime = Date.now() + 120000; // 2 minutes from now
    setReservationTimer(expirationTime);

    try {
      await acquireSemaphore();
      await patchEvent(event.id, -1);

      if (socket) {
        socket.emit('patch-event', {
          eventId: event.id,
          availableSlots: Number(event.availableSlots) - 1,
        });
      }

      setIsDialogOpen(true);
    } catch (error) {
      console.error('Erro ao reservar vaga temporária:', error);
      setReservationTimer(null);
    }
  };

  const confirmReservation = async () => {
    setIsDialogOpen(false);
    setReservationTimer(null);
    handleRelease();
  };

  const handleCancelReservation = async () => {
    setIsDialogOpen(false);
    handleRelease();

    try {
      await patchEvent(event.id, 1);

      if (socket) {
        socket.emit('patch-event', {
          eventId: event.id,
          availableSlots: Number(event.availableSlots) + 1,
        });
      }

      console.log('Reserva cancelada e vaga devolvida.');
    } catch (error) {
      console.error('Erro ao devolver vaga:', error);
    }
  };

  const handleRelease = async () => {
    await releaseSemaphore();
    setReservationTimer(null);
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
          <Button onClick={handleReserve} disabled={event.availableSlots === 0 || !isActive}>
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
            <AlertDialogCancel onClick={handleCancelReservation}>
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
