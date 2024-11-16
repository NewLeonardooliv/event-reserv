'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createEvent, updateSettings } from '../../lib/actions'

export default function AdminPage() {
  const [eventName, setEventName] = useState('')
  const [eventSlots, setEventSlots] = useState('')
  const [maxUsers, setMaxUsers] = useState('')
  const [choiceTime, setChoiceTime] = useState('')

  const handleCreateEvent = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      await createEvent({ name: eventName, slots: parseInt(eventSlots) })
      setEventName('')
      setEventSlots('')
    } catch (error) {
      console.error('Erro ao criar evento:', error)
    }
  }

  const handleUpdateSettings = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      await updateSettings({ maxUsers: parseInt(maxUsers), choiceTime: parseInt(choiceTime) })
      // Optionally, show a success message
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <Input
                placeholder="Nome do Evento"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Número de Vagas"
                value={eventSlots}
                onChange={(e) => setEventSlots(e.target.value)}
              />
              <Button type="submit">Criar Evento</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <Input
                type="number"
                placeholder="Máximo de Usuários Simultâneos"
                value={maxUsers}
                onChange={(e) => setMaxUsers(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Tempo para Escolha (segundos)"
                value={choiceTime}
                onChange={(e) => setChoiceTime(e.target.value)}
              />
              <Button type="submit">Atualizar Configurações</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}