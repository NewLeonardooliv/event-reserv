'use client'

// import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { AlertCircle } from 'lucide-react'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { setCookie } from "cookies-next"
// import { TOKEN } from '@/constants/token.constant'

export default function AdminPage() {
  // const [password, setPassword] = useState('')
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (password === 'admin') {
  //     setIsAuthenticated(true)
  //     setError(null)
  //     setCookie('token', TOKEN)
  //   } else {
  //     setError('Senha incorreta. Tente novamente.')
  //   }
  // }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle className="text-2xl font-bold">Acesso Administrativo</CardTitle>
  //           <CardDescription>Digite a senha para acessar o painel de administração.</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <form onSubmit={handlePasswordSubmit} className="space-y-4">
  //             <Input
  //               type="password"
  //               placeholder="Digite a senha"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //             />
  //             <Button type="submit" className="w-full">Entrar</Button>
  //             {error && (
  //               <Alert variant="destructive">
  //                 <AlertCircle className="h-4 w-4" />
  //                 <AlertTitle>Erro</AlertTitle>
  //                 <AlertDescription>{error}</AlertDescription>
  //               </Alert>
  //             )}
  //           </form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Evento</CardTitle>
            <CardDescription>Adicione um novo evento ao sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('/admin/create-event')} className="w-full">
              Ir para Criação de Evento
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
            <CardDescription>Ajuste as configurações globais do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigateTo('/admin/config')} className="w-full">
              Ir para Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}