// src/components/mapas/estilos.ts
import { CSSProperties } from 'react';


export const estiloLineaColindante = (feature: any) => {
  const color = feature.properties && feature.properties.colorOriginal
    ? feature.properties.colorOriginal
    : '#3388FF';
  return {
    color: color,
    weight: 4,
    opacity: 0.8,
    zIndex: 10
  };
};

export const estiloContenedorBotones: CSSProperties = {
  position: 'absolute',
  bottom: '15rem',
  right: 20,
  zIndex: 450,
  background: 'transparent',
  padding: '10px',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

export const estiloBoton = (isActive: boolean, color: string): CSSProperties => ({
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

export const estiloTextoEnCirculo = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  fontSize: '0.75rem',
  fontWeight: 'bold'
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
