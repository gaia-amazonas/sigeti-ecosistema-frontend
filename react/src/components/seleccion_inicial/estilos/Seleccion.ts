// src/components/seleccion_inicial/estilos/Seleccion.ts
import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: center;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  overflow-y: auto;
`;

export const Title = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #2f4f4f; /* Forest Green */
  font-family: 'Lora', serif;
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  color: #fff;
  background-color: #4682b4; /* Sky Blue */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Open Sans', sans-serif;

  &:hover {
    background-color: #0056b3; /* Darker Blue */
  }
`;
