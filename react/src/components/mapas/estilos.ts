import { CSSProperties } from "styled-components";

export const estiloLinea = {
  color: '#FF0000', // Red
  weight: 8,
  opacity: 0.6
};

export const estiloTerritorio = {
  color: '#3388FF',  // Blue
  weight: 2,
  opacity: 0.6,
  fillColor: '#3388FF',
  fillOpacity: 0.2
};

export const estiloContenedorBotones: CSSProperties = {
  position: 'absolute',
  bottom: '10rem',
  right: 20,
  zIndex: 1000,
  background: 'transparent',
  padding: '10px',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

export const estiloBoton = (isActive: boolean, color: string) => ({
  backgroundColor: isActive ? color : 'gray',
  opacity: isActive ? 0.8 : 0.6,
  color: 'white',
  border: 'none',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: isActive ? 'bold' : 'normal'
});

export const estiloCirculo = {
  width: '20px',
  height: '20px',
  backgroundColor: 'orange',
  borderRadius: '50%',
  cursor: 'pointer',
  margin: '5px',
};

export const estiloContenedorLineaTiempo = {
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  height: 'auto'
};

export const estiloContenedorInformacion = {
  marginTop: '10px',
  width: '100%'
};
