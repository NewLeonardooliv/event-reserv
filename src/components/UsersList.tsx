'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/data';
import { useSocket } from '@/hooks/useSocket';
import { Zap } from 'lucide-react';

export default function UsersList({ isActive, setIsActive }: { isActive: boolean, setIsActive: (isActive: boolean) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  // const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('updateUsers', (updatedUsers: User[]) => {
        setUsers(updatedUsers);
        if (socket.id) {
          const position = updatedUsers.findIndex(user => user.id === socket.id && !activeUsers.includes(user.id));
          setUserPosition(position !== -1 ? position + 1 : null);
        }
      });

      socket.on('updateActiveUsers', (updatedActiveUsers: string[]) => {
        setActiveUsers(updatedActiveUsers);
      });

      socket.on('activateUser', ({ timeLimit }) => {
        setIsActive(true);
        setTimeLeft(timeLimit / 1000);
      });

      socket.emit('getInitialData');

      return () => {
        socket.off('updateUsers');
        socket.off('updateActiveUsers');
        socket.off('activateUser');
      };
    }
  }, [socket, activeUsers]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      socket?.emit('finishInteraction');
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, socket]);

  const handleJoinQueue = () => {
    if (socket && socket.id) {
      socket.emit('joinQueue', { name: `User ${socket.id.substr(0, 4)}` });
    }
  };

  const handleLeaveQueue = () => {
    if (socket && socket.id) {
      socket.emit('leaveQueue');
      setUserPosition(null);
    }
  };

  return (
    <Card className="h-[calc(100vh-5rem)] w-full max-w-sm border-none flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Usuários Online <Badge variant="secondary" className="ml-2">{users.length}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">Usuários</h3>
        <ScrollArea className="flex-1 rounded-md border p-4">
          <ul className="space-y-2">
            {users.map((user, index) => (
              <li key={user.id} className="flex items-center space-x-2">
                {activeUsers.includes(user.id) && <Zap className="h-4 w-4 text-yellow-500" />}
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

      <CardFooter className="p-4 flex flex-col items-center">
        {isActive ? (
          <div className="text-center mb-2">
            <p>Tempo restante: {timeLeft} segundos</p>
          </div>
        ) : userPosition ? (
          <Button
            className="w-full mb-2"
            onClick={handleLeaveQueue}
            variant="destructive"
          >
            Sair da Fila (Posição: {userPosition})
          </Button>
        ) : (
          <Button
            className="w-full mb-2"
            onClick={handleJoinQueue}
          >
            Entrar na Fila
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}