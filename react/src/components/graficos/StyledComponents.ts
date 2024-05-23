import styled from 'styled-components';

export const ContenedorGrafico = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 250px;
`;

export const ContenedorImagen = styled.div`
  position: relative;
  width: 15rem;
  height: 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

export const Imagen = styled.img`
  width: 100%;
  height: 100%; /* Adjust height to maintain aspect ratio */
  object-fit: contain;
`;

export const RectanguloAmarillo = styled.div`
  background-color: #F3D090;
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 4rem;
`;

export const ContenedorTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 0 20px;
`;

export const CajaTitulo = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: black;
  font-size: 24px;
  font-weight: bold;
  z-index: 2;
`;

export const CajaReductor = styled.div`
  width: 90%;
  background-color: #BE4D60;
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 10px;
  display: flex;
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
`;
