// src/pages/estilos/Boton.ts
import styled from 'styled-components';

export const Boton = styled.button`
  width: 80%;
  padding: 15px;
  margin: 10px 0;
  font-size: 1.2em;
  color: #fff;
  background-color: #4682b4; /* Sky Blue */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Roboto', sans-serif;

  &:hover {
    background-color: #0056b3; /* Darker Blue */
  }

  &:focus {
    outline: none;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

export const BotonesContenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

export const Titulo = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F;
  text-align: center;
  margin-top: 20px;
`;
