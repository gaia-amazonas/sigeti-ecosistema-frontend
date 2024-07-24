// src/components/consultaConAlfanumericos/general/MapaComunidades.tsx

import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { traeSexosPorComunidad } from 'buscadores/paraMapa';
import logger from 'utilidades/logger';
import isClient from 'utilidades/isClient';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, Marker } from 'react-leaflet';
import CustomCircleMarker from './CustomCircleMarker';
import MarcadorConSexosPorComunidadGraficoTorta from './sexosPorComunidadGraficoTorta/MarcadorConSexosPorComunidadGraficoTorta';

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

const getColor = (value: number, min: number, max: number): string => {
  const normalizedValue = (Math.log(value + 1) - Math.log(min + 1)) / (Math.log(max + 1) - Math.log(min + 1));
  const red = 255;
  const green = 255 * (1 - normalizedValue);
  const blue = 0;
  return `rgb(${red}, ${green}, ${blue})`;
};

const getCoordinates = (geometry: any): number[][] => {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates[0];
  } else if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates[0][0];
  } else if (geometry.type === 'Point') {
    return [geometry.coordinates];
  } else if (geometry.type === 'MultiPoint') {
    return [geometry.coordinates[0]];
  } else {
    return [];
  }
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

  const totalPopulations = comunidadesGeoJson?.features.map(comunidad => {
    const id = comunidad.properties?.id;
    const datos = sexosPorComunidad[id] || { hombres: 0, mujeres: 0 };
    return datos.hombres + datos.mujeres;
  });
  const minPopulation = totalPopulations ? Math.min(...totalPopulations) : 0;
  const maxPopulation = totalPopulations ? Math.max(...totalPopulations) : 0;

  return (
    <MapContainer center={[centroMapa[0], centroMapa[1]]} zoom={6} style={{ height: '30rem', width: '100%', zIndex: 1 }}>
      <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
      <TileLayer
        url={modo === "online" ? "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRyaXJzZ2FpYSIsImEiOiJjazk0d3RweHIwaGlvM25uMWc5OWlodmI0In0.7v0BCtVHaGqVi2MnbLeM5Q" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
      />
      {territoriosGeoJson && (
        <GeoJSON data={territoriosGeoJson as FeatureCollection<Geometry, GeoJsonProperties>} style={estiloTerritorio} />
      )}
      {comunidadesGeoJson && (
        <>
          {comunidadesGeoJson.features.map((comunidad, index) => {
            const centroide = turf.centroid(comunidad).geometry.coordinates;
            const id = comunidad.properties?.id;
            const datos = sexosPorComunidad[id] || { hombres: 0, mujeres: 0 };
            const total = datos.hombres + datos.mujeres;
            const color = getColor(total, minPopulation, maxPopulation);
            const coordinates = getCoordinates(comunidad.geometry);
            if (coordinates.length === 0) return null;
            return (
              <React.Fragment key={index}>
                {(zoomNivel > 10) && (
                  <MarcadorConSexosPorComunidadGraficoTorta
                    posicion={[centroide[1], centroide[0]]}
                    datos={datos}
                    estaCargando={cargando[id]}
                  />
                )}
                {(zoomNivel <= 10) && (
                  <CustomCircleMarker
                    center={[coordinates[0][1], coordinates[0][0]]}
                    baseRadius={2}
                    color={color}
                    proporcion={total}
                    total={total}
                    zoomNivel={zoomNivel}
                  />
                )}
                {zoomNivel >= 13 && crearMarcadorNombre(comunidad.properties?.nombre) && (
                  <Marker
                    position={[centroide[1], centroide[0] - centroide[0] * 0.00015]}
                    icon={crearMarcadorNombre(comunidad.properties?.nombre)}
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
