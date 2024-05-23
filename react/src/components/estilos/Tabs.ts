import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F; /* Forest Green */
  text-align: center;
  margin: 20px 0;
`;

export const TabList = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
`;

export const TabStyle = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? '#228B22' : '#8B4513')}; /* Amazonian Green or Earth Brown */
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  margin: 0 5px;
  flex: 1;
  text-align: center;
  &:hover {
    background-color: #4682B4; /* Sky Blue */
  }
`;

export const TabPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  font-family: 'Roboto', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
`;
