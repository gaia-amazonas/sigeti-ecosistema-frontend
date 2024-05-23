import styled from 'styled-components';

export const ContenedorGrafico = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap */
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%; /* Full width of the container */
  height: auto;
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 48rem) {
    flex-direction: column;
    height: auto;
  }
`;

export const ContenedorImagen = styled.div`
  position: relative;
  width: 20%;
  height: auto;
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
  margin-bottom: 1rem;
`;

export const RectanguloAmarillo = styled.div`
  background-color: #F3D090;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
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
  width: 20%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const CajaTitulo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: transparent;
  color: black;
  font-size: 1rem;
  font-weight: bold;
  z-index: 2;
`;

export const CajaReductor = styled.div`
  width: 80%;
  background-color: #BE4D60;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
  display: flex;
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
`;
