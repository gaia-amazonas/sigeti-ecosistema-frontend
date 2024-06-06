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

export function obtieneColorRandom() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


export const estiloTerritorio = (feature: any) => {
  const color = feature.variables && colorMapping[feature.variables.id]
    ? colorMapping[feature.variables.id]
    : '#3388FF';
  return {
    color: "#7D7D7D",
    weight: 2,
    opacity: 0.6,
    fillColor: color,
    fillOpacity: 0.8,
    zIndex: 5
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