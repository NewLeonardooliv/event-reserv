'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User } from '@/lib/data'

interface UsersListProps {
  onlineUsers: User[];
  waitingList: User[];
}

export default function UsersList({ onlineUsers, waitingList }: UsersListProps) {
  return (
    <Card className="w-full max-w-sm border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="online">
              Online <Badge variant="secondary" className="ml-2">{onlineUsers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="waiting">
              Fila de Espera <Badge variant="secondary" className="ml-2">{waitingList.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="online">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <ul className="space-y-2">
                {onlineUsers.map((user) => (
                  <li key={user.id} className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>{user.name}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="waiting">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <ul className="space-y-2">
                {waitingList.map((user, index) => (
                  <li key={user.id} className="flex items-center space-x-2">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span>{user.name}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}