import styled from 'styled-components';

export const ContenedorGrafico = styled.div`
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: row; 
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  margin-bottom: 2rem;
  @media (max-width: 48rem) {
    flex-direction: row;
    flex-wrap: nowrap; /* Ensure no wrap on smaller screens as well */
    height: auto;
  }
`;

export const ContenedorImagen = styled.div`
  position: relative;
  width: auto;
  min-width: 6rem;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Imagen = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 1rem;
`;

export const TextoIndicativo = styled.div`
  background-color: transparent;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: red;
  font-size: 1rem;
  z-index: 2;
`;

export const RectanguloAmarillo = styled.div`
  background-color: #F3D090;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;
`;

export const ContenedorTotal = styled.div`
  position: relative;
  width: 29vw;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CajaTitulo = styled.div`
  margin-top: 2rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: transparent;
  color: black;
  font-size: 1.5rem;
  font-weight: bold;
  z-index: 2;
`;

export const CajaReductor = styled.div`
  background-color: #BE4D60;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
`;
