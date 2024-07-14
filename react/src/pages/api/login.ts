// src/pages/api/login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import users from '../../../users.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60,
          sameSite: 'strict',
          path: '/',
        })
      );
      return res.status(200).json({ message: 'Login successful', user });
    }
    return res.status(401).json({ message: 'Invalid username or password' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
