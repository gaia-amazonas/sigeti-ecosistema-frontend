// src/components/LogoutButton.tsx

import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });
    setUser(null);
    router.push('/');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
