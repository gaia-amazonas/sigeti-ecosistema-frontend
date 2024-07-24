// src/pages/estilos/boton.ts
import styled from 'styled-components';

const Boton = styled.button`
  width: 80%;
  padding: 15px;
  margin: 10px 0;
  font-size: 1.2em;
  color: #fff;
  background-color: rgba(70, 130, 180, 0.8);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, opacity 0.5s;
  font-family: 'Roboto', sans-serif;
  opacity: 0;

  &:hover {
    background-color: rgba(0, 86, 179, 0.8);
  }

  &:focus {
    outline: none;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const BotonesContenedor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: absolute;
  bottom: 10rem;
  right: 20px;
`;

export default Boton;
