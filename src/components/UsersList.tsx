'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/data';

interface UsersListProps {
  onlineUsers: User[];
  waitingList: User[];
}

export default function UsersList({ onlineUsers, waitingList }: UsersListProps) {
  return (
    <Card className="h-[calc(100vh-4rem)] w-full max-w-sm border-none flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Usuários Online <Badge variant="secondary" className="ml-2">{onlineUsers.length}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">Fila de Espera</h3>
        <ScrollArea className="flex-1 rounded-md border p-4">
          <ul className="space-y-2">
            {waitingList.map((user, index) => (
              <li key={user.id} className="flex items-center space-x-2">
                <Badge variant="outline">{index + 1}</Badge>
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4">
        <Button className="w-full">
          Entrar na Fila
        </Button>
      </CardFooter>
    </Card>
  );
}
