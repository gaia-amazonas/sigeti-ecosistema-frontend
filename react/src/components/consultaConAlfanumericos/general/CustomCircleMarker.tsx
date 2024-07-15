// src/components/consultaConAlfanumericos/general/CustomCircleMarker.tsx

import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from '../MapComponent.module.css';

interface CustomCircleMarkerProps {
  center: [number, number];
  baseRadius: number;
  color: string;
  proporcion: number;
  total: number;
  zoomNivel: number;
  onClick?: () => void;
}

const calculateAdjustedRadius = (zoomNivel: number): number => {
  if (zoomNivel <= 9) return zoomNivel;
  if (zoomNivel === 10) return zoomNivel ** 1.5;
  if (zoomNivel === 11) return zoomNivel ** 1.85;
  if (zoomNivel > 11) return zoomNivel ** 2.05;
  return zoomNivel ** 2.25;
};

const shouldDisplayText = (zoomNivel: number): boolean => {
  return zoomNivel >= 10;
};

const devuelveTexto = (expandido: boolean, total: number): string => {
  if (expandido) return `<div class="${styles['text-icon-container']}">${total}</div>`;
  return `<div class="${styles['text-icon-container']}">${total}</div>`;
}

const CustomCircleMarker: React.FC<CustomCircleMarkerProps> = ({ center, baseRadius, color, proporcion, total, zoomNivel, onClick }) => {
  const deberiaMostrarTextExpandido = (): boolean => {
    return zoomNivel >= 12;
  }
  const map = useMap();
  useEffect(() => {
    const adjustedRadius = calculateAdjustedRadius(zoomNivel);
    const circleMarker = L.circleMarker(center, {
      radius: adjustedRadius,
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
    }).addTo(map) as L.CircleMarker;
    if (onClick) {
      circleMarker.on('click', onClick);
    }
    let textMarker: L.Marker | null = null;
    if (shouldDisplayText(zoomNivel)) {
      const textIcon = L.divIcon({
        className: 'text-icon',
        html: devuelveTexto(deberiaMostrarTextExpandido(), total),
      });
      textMarker = L.marker(center, { icon: textIcon }).addTo(map) as L.Marker;
    }
    return () => {
      map.removeLayer(circleMarker as unknown as L.Layer);
      if (textMarker) {
        map.removeLayer(textMarker);
      }
    };
  }, [map, center, baseRadius, color, proporcion, total, zoomNivel, onClick]);
  return null;
};

export default CustomCircleMarker;
