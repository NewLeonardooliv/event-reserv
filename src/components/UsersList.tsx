'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/data';
import { useSocket } from '@/hooks/useSocket';

export default function UsersList() {
  const [onlineUsers, setOnlineUsers] = useState<User[]>();
  const [waitingList, setWaitingList] = useState<User[]>();
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      const updateWaitingList = (updatedList: User[]) => {
        setWaitingList(updatedList);
        if (socket.id) {
          const position = updatedList.findIndex(user => user.id === socket.id);
          setUserPosition(position !== -1 ? position + 1 : null);
          setIsInQueue(position !== -1);
        }
      };

      const updateOnlineUsers = (updatedList: User[]) => {
        setOnlineUsers(updatedList);
      };

      socket.on('updateWaitingList', updateWaitingList);
      socket.on('updateOnlineUsers', updateOnlineUsers);

      socket.emit('getInitialData');

      return () => {
        socket.off('updateWaitingList', updateWaitingList);
        socket.off('updateOnlineUsers', updateOnlineUsers);
      };
    }
  }, [socket]);

  const handleJoinQueue = () => {
    if (socket && socket.id) {
      socket.emit('joinQueue', { name: `User ${socket.id.substr(0, 4)}` });
      setIsInQueue(true);
    }
  };

  const handleLeaveQueue = () => {
    if (socket && socket.id) {
      socket.emit('leaveQueue');
      setIsInQueue(false);
      setUserPosition(null);
    }
  };

  return (
    <Card className="h-[calc(100vh-5rem)] w-full max-w-sm border-none flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Usuários Online <Badge variant="secondary" className="ml-2">{onlineUsers?.length || 0}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">Fila de Espera</h3>
        <ScrollArea className="flex-1 rounded-md border p-4">
          <ul className="space-y-2">
            {waitingList?.map((user, index) => (
              <li key={user.id} className="flex items-center space-x-2">
                <Badge variant="outline">{index + 1}</Badge>
                <span>{user.name}</span>
                {socket && socket.id === user.id && (
                  <Badge variant="secondary" className="ml-auto">Você</Badge>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4">
        {isInQueue ? (
          <Button 
            className="w-full" 
            onClick={handleLeaveQueue}
            variant="destructive"
          >
            Sair da Fila (Posição: {userPosition})
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleJoinQueue}
          >
            Entrar na Fila
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}