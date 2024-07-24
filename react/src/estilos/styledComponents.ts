// src/estilos/styledComponents.js
import styled, { keyframes } from 'styled-components';

// Define the keyframes for the animation
const show = keyframes`
  from {
    opacity: 0; 
    transform: scale(0.1);
  }
  to {
    opacity: 1; 
    transform: scale(1);
  }
`;

export const AnimatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-block: 128px;
  background: #111;

  > * {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 16px;
    animation: ${show} 0.5s forwards;
    animation-fill-mode: both;
  }
`;
