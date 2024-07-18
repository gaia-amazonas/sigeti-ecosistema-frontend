// src/components/consultaConAlfanumericos/educacional/MarcadorConEscolaridadPorComunidadGraficoTorta.tsx

import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import GraficoTorta from './GraficoTorta';
import estilos from 'estilosParaMapas/ParaMapas.module.css';

interface MarcadorConEscolaridadPorComunidadGraficoTortaProps {
  posicion: [number, number];
  datos: { sí: number; no: number };
  estaCargando: boolean;
}

const MarcadorConEscolaridadPorComunidadGraficoTorta: React.FC<MarcadorConEscolaridadPorComunidadGraficoTortaProps> = ({
  posicion,
  datos,
  estaCargando,
}) => {
  const mapa = useMap();
  const [posicionDePixel, establecerPosicionDePixel] = useState<[number, number] | null>(null);
  const [nivelDeZoom, establecerNivelDeZoom] = useState(mapa.getZoom());

  const actualizaPosicionDePixel = () => {
    if (mapa) {
      const punto = mapa.latLngToContainerPoint(posicion);
      establecerPosicionDePixel([punto.x, punto.y]);
    }
  };

  useMapEvents({
    move: () => {
      actualizaPosicionDePixel();
    },
    zoom: () => {
      establecerNivelDeZoom(mapa.getZoom());
      actualizaPosicionDePixel();
    },
  });

  useEffect(() => {
    actualizaPosicionDePixel();
  }, [mapa, posicion]);

  if (!posicionDePixel || nivelDeZoom <= 9) return null;

  return (
    <div
      style={{
        position: 'absolute',
        width: `${nivelDeZoom / 2}rem`,
        left: `${posicionDePixel[0]}px`,
        top: `${posicionDePixel[1]}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 400,
      }}
    >
      {estaCargando ? (
        <div className={estilos.spinnerMinimalista}></div>
      ) : (
        <GraficoTorta si={datos.sí} no={datos.no} />
      )}
    </div>
  );
};

export default MarcadorConEscolaridadPorComunidadGraficoTorta;
