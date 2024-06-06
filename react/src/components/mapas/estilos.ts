// src/components/mapas/estilos.ts

import { CSSProperties } from 'react';

const colorMapping: { [key: string]: string } = {
  "PN": "#FFE8C2",
  "BC": "#ECA98A",
  "YA": "#98C182",
  "IS": "#D9B5E8",
  "PH": "#e9b55f",
  "VI": "#e9c0b8",
  "GM": "#b18bb4",
  "AR": "#c9d979",
  "UI": "#4c85b4",
  "PP": "#d59196",
  "GA": "#2dbeb9",
  "TQ": "#ecec9d",
  "MP": "#bbaf7b"
};

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const estiloLinea = {
  color: '#FF0000', // This can be ignored or set as a default
  weight: 13,
  opacity: 0.6,
  zIndex: 10,
};


export const estiloTerritorio = (feature: any) => {
  const color = feature.properties && colorMapping[feature.properties.id]
    ? colorMapping[feature.properties.id]
    : '#3388FF';
  return {
    color: "#7D7D7D",
    weight: 2,
    opacity: 0.6,
    fillColor: color,
    fillOpacity: 0.8,
    zIndex: 5 // Ensure polygons are below lines
  };
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

export const estiloComunidad = {
  radius: 8,
  fillColor: '#000000',
  color: '#000000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.3,
};

export const estiloDot = {
  radius: 2,
  fillColor: '#000000',
  color: '#000000',
  weight: 1,
  opacity: 1,
  fillOpacity: 1,
};