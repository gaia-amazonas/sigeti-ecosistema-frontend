import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  overflow-y: auto;  // Only TabPanel scrolls
  display: grid;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
`;

export const Title = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F; /* Forest Green */
  text-align: center;
  margin-bottom: 1rem;
`;

export const TabList = styled.div`
  max-height: 5rem;
  display: flex;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  // Shadow for a better visual separation
`;

export const TabStyle = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? '#228B22' : '#8B4513')}; /* Amazonian Green or Earth Brown */
  color: white;
  padding: 1rem;
  border: none;
  cursor: pointer;F
  margin: 0 0.5rem;
  flex: 1;
  text-align: center;
  &:hover {
    background-color: #4682B4; /* Sky Blue */
  }
`;

export const TabPanel = styled.div`
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;