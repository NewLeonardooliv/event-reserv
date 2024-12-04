'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createEvent } from '@/http/createEvents'
import { useSocket } from '@/hooks/useSocket'

interface EventFormData {
  eventName: string
  eventSlots: number
}

export default function CriarNovoEvento() {
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const socket = useSocket()

  useEffect(() => {
    if (socket) {
      socket.on('receive-event', (message: string) => {
        console.log('Recebido do servidor:', message)
      })
    }
  }, [socket])

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const newEvent = await createEvent({
        id: Math.random().toString(36).substring(2, 9),
        name: data.eventName,
        availableSlots: data.eventSlots
      })

      if (socket) {
        socket.emit('create-event', JSON.stringify(newEvent))
      }

      setSuccess(true)
      setTimeout(() => router.push('/admin'), 2000)
    } catch (error) {
      setError('Ocorreu um erro ao criar o evento. Por favor, tente novamente.')
      console.error('Erro ao criar evento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Criar Novo Evento</CardTitle>
            <CardDescription>Preencha os detalhes do novo evento abaixo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="eventName">Nome do Evento</Label>
              <Input
                id="eventName"
                placeholder="Digite o nome do evento"
                {...register("eventName", { required: "Nome do evento é obrigatório" })}
              />
              {errors.eventName && (
                <p className="text-red-500 text-sm">{errors.eventName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventSlots">Número de Vagas</Label>
              <Input
                id="eventSlots"
                type="number"
                placeholder="Digite o número de vagas"
                {...register("eventSlots", { 
                  required: "Número de vagas é obrigatório",
                  min: { value: 1, message: "O número de vagas deve ser pelo menos 1" }
                })}
              />
              {errors.eventSlots && (
                <p className="text-red-500 text-sm">{errors.eventSlots.message}</p>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="bg-green-100 border-green-400 dark:bg-green-800 dark:border-green-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>Evento criado com sucesso! Redirecionando...</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()} type="button">Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Evento'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}