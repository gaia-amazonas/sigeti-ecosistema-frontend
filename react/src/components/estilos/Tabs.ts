import styled from 'styled-components';

export const Contenedor = styled.div`
  font-family: 'Roboto', sans-serif;
  display: grid;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
`;

export const Titulo = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F;
  text-align: center;
`;

export const ListaTabs = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  // Shadow for a better visual separation
`;

export const EstiloTab = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? '#228B22' : '#8B4513')}; /* Amazonian Green or Earth Brown */
  color: white;
  padding: 1rem;
  border: none;
  cursor: pointer;
  flex: 1;
  text-align: center;
  &:hover {
    background-color: #4682B4; /* Sky Blue */
  }
`;

export const PanelTabs = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
`;