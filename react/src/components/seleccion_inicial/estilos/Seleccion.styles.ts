import styled from 'styled-components';

export const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const Title = styled.h1`
  font-family: 'Lora', serif;
  color: #2F4F4F;
`;

export const Button = styled.button`
  background-color: #228B22;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  &:hover {
    background-color: #196619;
  }
`;
