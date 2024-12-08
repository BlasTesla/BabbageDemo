import { useState } from 'react'
import { Message } from '../lib/types'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendUserMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input.trim() }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();
    if (data.answer) {
      const assistantMessage: Message = { role: 'assistant', content: data.answer };
      setMessages([...newMessages, assistantMessage]);
    } else {
      const assistantMessage: Message = { role: 'assistant', content: 'No response' };
      setMessages([...newMessages, assistantMessage]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4">Babbage AI Agent</h1>
        <div className="border p-2 mb-4 h-64 overflow-auto">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <p><strong>{msg.role === 'user' ? 'You:' : 'Babbage:'}</strong> {msg.content}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-gray-500 text-center">Send a message to start</p>
          )}
        </div>
        <div className="flex">
          <input
            className="border flex-1 p-2 rounded mr-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={sendUserMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
