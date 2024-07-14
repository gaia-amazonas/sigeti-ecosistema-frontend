import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = cookie.parse(req.headers.cookie || '');

  if (token) {
    const user = JSON.parse(token);
    return res.status(200).json({ authenticated: true, user });
  }

  return res.status(401).json({ authenticated: false });
}
