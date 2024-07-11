// src/components/consultaConAlfanumericos/general/MapaComunidades.tsx

import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { traeSexosPorComunidad } from 'buscadores/paraMapa';
import Comunidades from '../../Comunidades';
import MarcadorConSexosPorComunidadGraficoTorta from './sexosPorComunidadGraficoTorta/MarcadorConSexosPorComunidadGraficoTorta';
import logger from 'utilidades/logger';
import isClient from 'utilidades/isClient';
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from 'react-leaflet';

interface MapaImp {
  territoriosGeoJson: FeatureCollection;
  comunidadesGeoJson: FeatureCollection;
  modo: string | string[];
}

const ControlaEventosDeMapa = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
  useMapEvents({
    zoomend: (e: { target: { getZoom: () => number; }; }) => {
      setZoomLevel(e.target.getZoom());
    }
  });
  return null;
};

const Mapa: React.FC<MapaImp> = ({ territoriosGeoJson, comunidadesGeoJson, modo }) => {
  const centroMapa = [0.969793, -70.830454];
  const [zoomNivel, establecerZoomNivel] = useState<number>(6);
  const [sexosPorComunidad, setSexosPorComunidad] = useState<{ [id: string]: { hombres: number, mujeres: number } }>({});
  const [cargando, setCargando] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const ordenaSexosPorComunidad = async () => {
      try {
        const sexosPorComunidad = await traeSexosPorComunidad(modo);
        const comunidades = sexosPorComunidad.rows;
        comunidades.forEach((comunidad: any) => {
          const id = comunidad.id;
          const hombres = comunidad.hombres || 0;
          const mujeres = comunidad.mujeres || 0;
          setSexosPorComunidad(prev => ({ ...prev, [id]: { hombres, mujeres } }));
          setCargando(prev => ({ ...prev, [id]: false }));
        });
      } catch (error) {
        logger.error('Error buscando sexos por comunidad:', error);
      }
    };
    ordenaSexosPorComunidad();
  }, [comunidadesGeoJson, modo]);

  const crearMarcadorNombre = (nombre: string) => {
    if (!isClient) return null;
    const leaflet = require('leaflet');
    return leaflet.divIcon({
      html: `<div style="z-index: 10;
            font-size: 1rem;
            font-weight: bold;
            color: black;
            background: white;
            margin-left: 0rem;
            margin-right: 0;
            border-radius: 1rem;
            padding-left: 1rem;
            padding-right: 5rem">${nombre}</div>`,
      iconSize: [nombre.length * 6, 20],
      iconAnchor: [nombre.length * 3, 10],
      className: ''
    });
  };

  return (
    <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
      <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
      <TileLayer
        url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
      />
      { territoriosGeoJson && (
        <GeoJSON data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
      )}
      { comunidadesGeoJson && (
        <>
          <Comunidades comunidadesGeoJson={comunidadesGeoJson} />
          {comunidadesGeoJson.features.map((comunidad, index) => {
            const centroide = turf.centroid(comunidad).geometry.coordinates;
            const id = comunidad.properties?.id;
            const datos = sexosPorComunidad[id] || { hombres: 0, mujeres: 0 };
            const estaCargando = cargando[id];
            const nombre = comunidad.properties?.nombre || '';
            return (
              <React.Fragment key={index}>
                <MarcadorConSexosPorComunidadGraficoTorta
                  posicion={[centroide[1], centroide[0]]}
                  datos={datos}
                  estaCargando={estaCargando}
                />
                {zoomNivel >= 13 && crearMarcadorNombre(nombre) && (
                  <Marker
                    position={[centroide[1], centroide[0] - centroide[0] * 0.00015]}
                    icon={crearMarcadorNombre(nombre)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </>
      )}
    </MapContainer>
  );
};

export default Mapa;
