// src/components/mapas/estilos.ts
import { CSSProperties } from 'react';

const mapeaColor: { [key: string]: string } = {
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

export const estiloTerritorio = (feature: any) => {
  const color = feature.properties && mapeaColor[feature.properties.id]
    ? mapeaColor[feature.properties.id]
    : '#3388FF';
  return {
    color: "#7D7D7D",
    weight: 2,
    opacity: 0.8,
    fillColor: color,
    fillOpacity: 0.6,
    zIndex: 5
  };
};

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