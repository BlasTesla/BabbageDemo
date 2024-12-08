// pages/index.tsx
import { useState } from 'react'
import { Message } from '../lib/types'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendUserMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user' as const, content: input.trim() }];
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="max-w-2xl w-full flex flex-col space-y-4">
        <header className="w-full flex items-center justify-between py-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white">Babbage AI Agent</h1>
          <nav className="space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition">FAQ</a>
          </nav>
        </header>

        <div className="flex-1 border border-gray-800 rounded p-4 h-96 overflow-auto bg-black">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center">Send a message to start</p>
          )}
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const bubbleClass = isUser ? 'bg-gray-800 text-gray-100 text-right self-end' : 'bg-gray-900 text-gray-200 text-left';
            return (
              <div key={i} className={`mb-2 max-w-prose p-3 rounded-lg ${bubbleClass}`}>
                <p><strong>{isUser ? 'You:' : 'Babbage:'}</strong> {msg.content}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <input
            className="border border-gray-700 bg-black text-white p-2 rounded focus:border-blue-500 outline-none w-full"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-all font-medium"
            onClick={sendUserMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
