// src/components/consultaConAlfanumericos/general/MapaPoblacionEnComunidades.tsx

import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
import bbox from '@turf/bbox';
import React, { useEffect, useState } from 'react';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { estiloTerritorio } from 'estilosParaMapas/paraMapas';
import { traeSexosPorComunidad } from 'buscadores/paraMapa';
import logger from 'utilidades/logger';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import CustomCircleMarker from './CustomCircleMarker';
import MarcadorConSexosPorComunidadGraficoTorta from './sexosPorComunidadGraficoTorta/MarcadorConSexosPorComunidadGraficoTorta';
import L from 'leaflet';

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

const AdjustMapBounds = ({ territoriosGeoJson }: { territoriosGeoJson: FeatureCollection }) => {
  const map = useMap();

  useEffect(() => {
    if (territoriosGeoJson) {
      const bounds = bbox(territoriosGeoJson);
      map.fitBounds([
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]]
      ]);
    }
  }, [territoriosGeoJson, map]);

  return null;
};

const Legend = ({ min, max }: { min: number; max: number }) => {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML = `
        <h4>Población</h4>
        <div style="background: linear-gradient(to right, rgb(255, 255, 0), rgb(255, 0, 0)); width: 100px; height: 20px; border-radius: 5px;"></div>
        <div style="display: flex; justify-content: space-between;">
          <span>${min}</span><span>${max}</span>
        </div>
        <div>
          <i style="background: rgb(255, 255, 0); width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>Baja
          <br>
          <i style="background: rgb(255, 0, 0); width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px;"></i>Alta
        </div>
      `;
      return div;
    };
    legend.addTo(map);
    return () => {
      map.removeControl(legend);
    };
  }, [map, min, max]);

  return null;
};

const Mapa: React.FC<MapaImp> = ({ territoriosGeoJson, comunidadesGeoJson, modo }) => {
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

  const totalPopulations = comunidadesGeoJson?.features.map(comunidad => {
    const id = comunidad.properties?.id;
    const datos = sexosPorComunidad[id] || { hombres: 0, mujeres: 0 };
    return datos.hombres + datos.mujeres;
  });
  const minPopulation = totalPopulations ? Math.min(...totalPopulations) : 0;
  const maxPopulation = totalPopulations ? Math.max(...totalPopulations) : 0;

  return (
    <MapContainer style={{ height: '30rem', width: '100%', zIndex: 1, borderRadius: '3rem' }}>
      <ControlaEventosDeMapa setZoomLevel={establecerZoomNivel} />
      <AdjustMapBounds territoriosGeoJson={territoriosGeoJson} />
      <Legend min={minPopulation} max={maxPopulation} />
      <TileLayer
        url={modo === "online" ? "https://api.maptiler.com/maps/d2c25c43-29c2-47a0-ac77-01ac61ddfd97/256/{z}/{x}/{y}.png?key=aSbUrcjlnwB0XPSJ7YAw" : "http://localhost:8080/{z}/{x}/{y}.png.tile"}
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
              </React.Fragment>
            );
          })}
        </>
      )}
    </MapContainer>
  );
};

export default Mapa;
