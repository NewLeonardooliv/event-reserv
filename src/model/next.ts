import { NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseSocket = NextApiResponse & {
  socket: NodeJS.Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};