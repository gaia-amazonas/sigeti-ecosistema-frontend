import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const OptionButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  margin: 10px 0;
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

export const Title = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #2f4f4f; /* Forest Green */
  font-family: 'Lora', serif;
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
`;
