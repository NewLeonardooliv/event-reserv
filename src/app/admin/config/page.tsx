'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateSettings, getSettings } from '@/lib/actions'

interface SystemSettings {
    maxUsers: number;
    choiceTime: number;
    allowWaitlist: boolean;
    autoConfirmReservations: boolean;
}

export default function ConfiguracoesDoSistema() {
    const [settings, setSettings] = useState<SystemSettings>({
        maxUsers: 10,
        choiceTime: 120,
        allowWaitlist: true,
        autoConfirmReservations: false,
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSaved, setIsSaved] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const currentSettings = await getSettings()
                setSettings(currentSettings)
            } catch (error) {
                console.error('Erro ao carregar configurações:', error)
                setError('Não foi possível carregar as configurações. Por favor, tente novamente.')
            }
        }

        fetchSettings()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setIsSaved(false)

        try {
            await updateSettings(settings)
            setIsSaved(true)
            setTimeout(() => setIsSaved(false), 3000)
        } catch (error) {
            setError('Ocorreu um erro ao salvar as configurações. Por favor, tente novamente.')
            console.error('Erro ao atualizar configurações:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        setSettings(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) : value
        }))
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Configurações do Sistema</CardTitle>
                    <CardDescription>Ajuste as configurações globais do sistema de reservas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxUsers">Máximo de Usuários Simultâneos</Label>
                            <Input
                                id="maxUsers"
                                name="maxUsers"
                                type="number"
                                value={settings.maxUsers}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="choiceTime">Tempo para Escolha (segundos)</Label>
                            <Input
                                id="choiceTime"
                                name="choiceTime"
                                type="number"
                                value={settings.choiceTime}
                                onChange={handleInputChange}
                                required
                                min="30"
                            />
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erro</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {isSaved && (
                            <Alert variant="default">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Sucesso</AlertTitle>
                                <AlertDescription>As configurações foram salvas com sucesso.</AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push('/admin')}>Voltar</Button>
                    <Button type="submit" disabled={isLoading} onClick={() => handleSubmit}>
                        {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}