'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createEvent } from '@/lib/actions'

export default function CriarNovoEvento() {
  const [eventName, setEventName] = useState('')
  const [eventSlots, setEventSlots] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!eventName || !eventSlots) {
      setError('Por favor, preencha todos os campos.')
      setIsLoading(false)
      return
    }

    try {
      await createEvent({
        name: eventName,
        slots: parseInt(eventSlots, 10)
      })
      router.push('/eventos')
    } catch (error) {
      setError('Ocorreu um erro ao criar o evento. Por favor, tente novamente.')
      console.error('Erro ao criar evento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Criar Novo Evento</CardTitle>
          <CardDescription>Preencha os detalhes do novo evento abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Nome do Evento</Label>
              <Input
                id="eventName"
                placeholder="Digite o nome do evento"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventSlots">Número de Vagas</Label>
              <Input
                id="eventSlots"
                type="number"
                placeholder="Digite o número de vagas"
                value={eventSlots}
                onChange={(e) => setEventSlots(e.target.value)}
                required
                min="1"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" disabled={isLoading} onClick={() => handleSubmit}>
            {isLoading ? 'Criando...' : 'Criar Evento'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}