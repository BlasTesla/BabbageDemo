import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMessage } from '../../lib/openai'
import { Message } from '../../lib/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  try {
    const result = await sendMessage({ messages });
    return res.status(200).json({ answer: result.explanation, decision: result.decision });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: 'Error calling the AI model' });
  }
}
