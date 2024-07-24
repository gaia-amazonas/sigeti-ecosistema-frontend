// src/components/LoginForm.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import styled from 'styled-components';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FormGroup>
        <label htmlFor="username">Usuario: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">Contraseña: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormGroup>
      <button type="submit">Iniciar Sesión</button>
      {error && <p>{error}</p>}
    </StyledForm>
  );
};

const StyledForm = styled.form`
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;

  label {
    text-align: right;
    color: #ffffff;
  }

  input {
    padding: 5px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    width: 60%;
    font-family: monospace;
  }
`;

export default LoginForm;
