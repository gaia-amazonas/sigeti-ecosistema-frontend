import styled from 'styled-components';

export const Contenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  max-width: 70%;
  height: 100%;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

export const OpcionComoBoton = styled.button<{ seleccionado?: boolean }>`
  width: 100%;
  padding: 10px 20px;
  margin: 10px 0;
  font-size: 1em;
  color: #fff;
  background-color: ${props => props.seleccionado ? '#0056b3' : '#4682b4'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Open Sans', sans-serif;
  &:hover {
    background-color: #0056b3;
  }
`;

export const Titulo = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #2f4f4f;
  font-family: 'Lora', serif;
`;

export const FiltraEntrada = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
`;

export const BotonSiguiente = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1em;
  color: #fff;
  background-color: #32cd32;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Open Sans', sans-serif;
  &:hover {
    background-color: #228b22;
  }
`;
