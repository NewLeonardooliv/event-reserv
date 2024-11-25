'use client'

import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3002')

export default function SocketComponent() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    socket.on('receive-message', (message: string) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('receive-message')
    }
  }, [])

  const sendMessage = () => {
    if (inputMessage) {
      socket.emit('send-message', inputMessage)
      setInputMessage('')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Socket.IO Chat</h2>
      <p className="mb-2">Status: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      <div className="mb-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Digite sua mensagem"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
          Enviar
        </button>
      </div>
      <div className="border p-4 h-64 overflow-y-auto">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  )
}

